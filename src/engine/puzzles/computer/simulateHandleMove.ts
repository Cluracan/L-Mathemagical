import type { KeyId } from "../../../assets/data/itemData";
import {
  directionAliases,
  directionNarratives,
  isDirectionAlias,
} from "../../constants/directions";
import type { ExitDirection, RoomId } from "../../../assets/data/roomData";
import { assertIsDefined } from "../../utils/assertIsDefined";
import { roomRegistry } from "../../world/roomRegistry";
import {
  blockedExitData,
  isBlockedRoom,
} from "../../../assets/data/blockedExitData";
import { MAX_RECURSION, type ComputerState } from "./computerConstants";
import { produce } from "immer";
import type { CommandArgs } from "./computerSimulation";
import { isPuzzleLocation } from "../puzzleRegistry";
import { computerNPC } from "./computerNPC";

// Types
interface MovePayload {
  computerState: ComputerState;
  target: string | null;
  keyLocked: Record<KeyId, boolean>;
  done: boolean;
  direction?: ExitDirection;
  nextRoom?: RoomId;
}

// Narrative Content
const moveFeedback = {
  notADirection: "That's not a direction!",
  noExit: "You can't go that way!",
  keyLocked:
    "A strange force prevents you from passing through this locked door.",
  passThough:
    "You are so faint in this universe that you are able to slip through...",
};

// Helpers
const validateDirection = (payload: MovePayload) => {
  const { target } = payload;
  if (!target || !isDirectionAlias(target)) {
    return produce(payload, (draft) => {
      const recursionLevel = draft.computerState.recursionLevel;
      draft.computerState.feedback[recursionLevel].push(
        moveFeedback.notADirection
      );
      draft.done = true;
    });
  }
  const direction = directionAliases[target];
  return { ...payload, direction };
};

const validateExit = (payload: MovePayload) => {
  assertIsDefined(payload.direction);
  const nextRoom = roomRegistry.getExitDestination(
    payload.computerState.currentLocation,
    payload.direction
  );
  if (!nextRoom) {
    return produce(payload, (draft) => {
      const recursionLevel = draft.computerState.recursionLevel;
      draft.computerState.feedback[recursionLevel].push(moveFeedback.noExit);
      draft.done = true;
    });
  }
  return { ...payload, nextRoom };
};

const runBlockedTriggers = (payload: MovePayload) => {
  const { currentLocation, recursionLevel } = payload.computerState;
  const { direction, keyLocked } = payload;
  assertIsDefined(direction);
  // No blockage
  if (!isBlockedRoom(currentLocation)) {
    return payload;
  }

  // Key required
  const blockedDirections: string[] =
    blockedExitData[currentLocation].direction;
  const keyRequred = blockedExitData[currentLocation].keyRequired;
  if (blockedDirections.includes(direction) && keyRequred) {
    return produce(payload, (draft) => {
      if (keyLocked[keyRequred]) {
        draft.computerState.feedback[recursionLevel].push(
          moveFeedback.keyLocked
        );
        draft.done = true;
      }
    });
  }

  // Blocked (no key) (max recursion -> walk through walls)
  if (
    blockedDirections.includes(direction) &&
    !keyRequred &&
    recursionLevel === MAX_RECURSION
  ) {
    return produce(payload, (draft) => {
      draft.computerState.feedback[recursionLevel].push(
        moveFeedback.passThough
      );
    });
  }
  return payload;
};

const movePlayer = (payload: MovePayload) => {
  return produce(payload, (draft) => {
    const recursionLevel = draft.computerState.recursionLevel;
    assertIsDefined(draft.nextRoom);
    assertIsDefined(draft.direction);
    draft.computerState.currentLocation = draft.nextRoom;
    draft.computerState.feedback[recursionLevel].push(
      `You travel ${directionNarratives[draft.direction]}`
    );
    const roomDescription = roomRegistry.getLongDescription(
      draft.computerState.currentLocation
    );
    draft.computerState.feedback[recursionLevel].push(roomDescription);
  });
};

const addPuzzleNPCDescription = (payload: MovePayload) => {
  return produce(payload, (draft) => {
    const recursionLevel = draft.computerState.recursionLevel;
    if (draft.computerState.currentLocation === "computer") {
      draft.computerState.feedback[recursionLevel].push(
        computerNPC.description.long
      );
    } else if (isPuzzleLocation(draft.computerState.currentLocation)) {
      draft.computerState.feedback[recursionLevel].push(
        "You sense a slight shimmering in the air here, but it is far too faint to see anything..."
      );
    }
  });
};

const movePipeline: ((payload: MovePayload) => MovePayload)[] = [
  validateDirection,
  validateExit,
  runBlockedTriggers,
  movePlayer,
  addPuzzleNPCDescription,
];

export function simulateHandleMove(args: CommandArgs) {
  const initialMovePayload: MovePayload = {
    computerState: args.computerState,
    target: args.target,
    keyLocked: args.keyLocked,
    done: false,
  };
  const finalPayload = movePipeline.reduce(
    (curPayload, curFunction) =>
      curPayload.done ? curPayload : curFunction(curPayload),
    initialMovePayload
  );

  return finalPayload.computerState;
}
