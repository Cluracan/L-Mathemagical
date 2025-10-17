import { produce, type Draft } from "immer";
import { isRoomId, type RoomId } from "../../assets/data/roomData";
import type { PipelineFunction, PipelinePayload } from "../pipeline/types";
import { puzzleAtLocation } from "../puzzles/puzzleRegistry";
import { itemRegistry } from "../world/itemRegistry";

// Types
export type DrogoGuard = null | { id: number; turnsUntilCaught: number };

// Type Assertions
function assertIsDefined<T>(
  val: T,
  msg?: string
): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(
      msg ||
        `Assertion error: expected 'val' to be defined, but received ${String(val)}`
    );
  }
}

// Config
const SAFE_ROOMS = new Set<RoomId>([
  "grass",
  "hallway",
  "code",
  "attic",
  "atticPassage",
  "pig",
  "guards",
  "cell",
  "countryside",
]);
for (const puzzleRoom of Object.keys(puzzleAtLocation)) {
  if (isRoomId(puzzleRoom)) {
    SAFE_ROOMS.add(puzzleRoom);
  }
}
const JAIL_ROOM: RoomId = "attic";
const DROGO_ALIASES = new Set(["drogo", "robot", "guard"]);
const DROGO_SPAWN_CHANCE_LOW = 1;
const DROGO_SPAWN_CHANCE_HIGH = 1;
export const DROGO_ID_MIN = 4;
export const DROGO_ID_MAX = 14;

// Narrative Content
const drogoFeedback = {
  moveAttempt: {
    hasTurnsRemaining:
      "The guard tries to catch you in its net, but you manage to dodge out of the way",
    isInvisible: "The guard senses your presence but is unable to see you",
  },
  sayAttempt: {
    unaffected:
      "The guard is unaffected. It tries to catch you, but you manage to dodge out of the way.",
    isInvisible:
      "The guard looks startled. It swings its net around wildly, but just misses you...",
  },

  capture:
    "The guard has caught you in its net! It carries you off to a remote room in the palace.",
  scared: "The guard gives a wail of terror and disappears out of sight.",
};

export const getDrogoDescription = (drogoGuard: DrogoGuard) => {
  return drogoGuard
    ? `There is a Drogo Robot Guard opposite you, carrying a huge butterfly net. Emblazoned across its front is the number ${String(drogoGuard.id ** 2)}`
    : null;
};

const getDrogoIdReminder = (id: number) => {
  return `Your eyes are drawn to the number '${String(id ** 2)}', which is emblazoned across the front of the robot.`;
};

// Helpers
const getDrogoChance = (room: RoomId) => {
  console.log(room);
  if (SAFE_ROOMS.has(room)) {
    return 0;
  }
  return room.startsWith("cellar")
    ? DROGO_SPAWN_CHANCE_HIGH
    : DROGO_SPAWN_CHANCE_LOW;
};

const spawnDrogoGuard = () => {
  const id =
    Math.floor(Math.random() * (DROGO_ID_MAX - DROGO_ID_MIN + 1)) +
    DROGO_ID_MIN;
  return { id, turnsUntilCaught: 3 };
};

const willScareGuard = (target: string, drogoGuard: DrogoGuard) => {
  const targetValue = Number(target);
  return !isNaN(targetValue) && targetValue === drogoGuard?.id;
};

const sendToJail = (draft: Draft<PipelinePayload>) => {
  draft.gameState.storyLine.push(drogoFeedback.capture);
  draft.gameState.currentRoom = JAIL_ROOM;
  draft.gameState.drogoGuard = null;
};

const confiscateItems = (draft: Draft<PipelinePayload>) => {
  const itemLocation = draft.gameState.itemLocation;
  for (const itemId of itemRegistry.getItemList()) {
    if (itemLocation[itemId] === "player") {
      itemLocation[itemId] = "cupboard";
    }
  }
};

export const runDrogoTriggers: PipelineFunction = (payload) => {
  const { command, target } = payload;
  const drogoGuardPresent = payload.gameState.drogoGuard !== null;

  if (!drogoGuardPresent) {
    if (command === "move") {
      return produce(payload, (draft) => {
        assertIsDefined(draft.nextRoom, "Expected nextRoom to be defined");
        const drogoChance = getDrogoChance(draft.nextRoom);
        const rng = Math.random();
        if (rng < drogoChance) {
          draft.gameState.drogoGuard = spawnDrogoGuard();
        }
      });
    } else {
      return payload;
    }
  }

  // DrogoGuard present
  switch (command) {
    case "move": {
      return produce(payload, (draft) => {
        const playerIsInvisible = draft.gameState.isInvisible;
        const drogoGuard = draft.gameState.drogoGuard;
        assertIsDefined(drogoGuard, "Expected drogoGuard to be defined");
        if (playerIsInvisible) {
          draft.gameState.storyLine.push(drogoFeedback.moveAttempt.isInvisible);
          draft.gameState.drogoGuard = null;
        } else {
          drogoGuard.turnsUntilCaught--;
          if (drogoGuard.turnsUntilCaught === 0) {
            confiscateItems(draft);
            sendToJail(draft);
          } else {
            draft.gameState.storyLine.push(
              drogoFeedback.moveAttempt.hasTurnsRemaining
            );
          }
          draft.done = true;
        }
      });
    }
    case "look": {
      //Look at guard
      if (target && DROGO_ALIASES.has(target)) {
        return produce(payload, (draft) => {
          const drogoGuard = draft.gameState.drogoGuard;
          assertIsDefined(drogoGuard, "Expected drogoGuard to be defined");
          draft.gameState.storyLine.push(getDrogoIdReminder(drogoGuard.id));
          draft.done = true;
        });
      }
      break;
    }
    case "say": {
      return produce(payload, (draft) => {
        const drogoGuard = draft.gameState.drogoGuard;
        assertIsDefined(drogoGuard, "Expected drogoGuard to be defined");
        if (target && willScareGuard(target, drogoGuard)) {
          draft.gameState.storyLine.push(drogoFeedback.scared);
          draft.gameState.drogoGuard = null;
        } else {
          drogoGuard.turnsUntilCaught--;
          if (drogoGuard.turnsUntilCaught === 0) {
            confiscateItems(draft);
            sendToJail(draft);
          } else {
            draft.gameState.storyLine.push(
              draft.gameState.isInvisible
                ? drogoFeedback.sayAttempt.isInvisible
                : drogoFeedback.sayAttempt.unaffected
            );
          }
        }
        draft.done = true;
      });
    }
  }
  return payload;
};
