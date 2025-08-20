import { roomRegistry } from "../world/roomRegistry";
import { itemRegistry } from "../world/itemRegistry";
import { isItemId, keyList } from "../../assets/data/itemData";
import type { GameState } from "../gameEngine";
import type {
  Command,
  CommandPayload,
  HandleCommand,
  PipelineFunction,
} from "./dispatchCommand";

type BuildRoomDescription = (args: {
  gameState: GameState;
  command: Command;
}) => string[];
export const buildRoomDescription: BuildRoomDescription = ({
  gameState,
  command,
}) => {
  const { visitedRooms, currentRoom, itemLocation } = gameState;
  const roomDescription = [];
  //Add room text
  roomDescription.push(
    visitedRooms.has(currentRoom) && command !== "look"
      ? roomRegistry.getShortDescription(currentRoom)
      : roomRegistry.getLongDescription(currentRoom)
  );

  //Add items
  const itemsPresent = [];
  for (const [item, location] of Object.entries(itemLocation)) {
    if (location === currentRoom && isItemId(item)) {
      itemsPresent.push(itemRegistry.getFloorDescription(item));
    }
  }
  roomDescription.push(...itemsPresent);

  //Add drogoGuard

  //add puzzleNPC
  return roomDescription;
};

const lookRoom: PipelineFunction = (payload) => {
  if (payload.target === null) {
    const roomDescription = buildRoomDescription({
      gameState: payload.gameState,
      command: "look",
    });
    return {
      ...payload,
      gameState: {
        ...payload.gameState,
        storyLine: [...payload.gameState.storyLine, ...roomDescription],
      },
      aborted: true,
    };
  }
  return payload;
};

const lookKey: PipelineFunction = (payload) => {
  const { itemLocation, storyLine, currentRoom } = payload.gameState;
  if (payload.target === "key") {
    //check for 1 or 2 keys on person or ground
    let visibleKeys = keyList.filter(
      (keyId) =>
        isItemId(keyId) &&
        (itemLocation[keyId] === "player" ||
          itemLocation[keyId] === currentRoom)
    );
    if (visibleKeys.length === 2) {
      return {
        ...payload,
        gameState: {
          ...payload.gameState,
          storyLine: [...storyLine, "Which key would you like to examine?"],
        },
        aborted: true,
      };
    }
    if (visibleKeys.length === 1) {
      return { ...payload, target: visibleKeys[0] };
    }
  }
  return payload;
};

const lookItem: PipelineFunction = (payload) => {
  const { gameState, target } = payload;
  const { itemLocation, currentRoom } = gameState;

  //Look at item
  if (target && isItemId(target)) {
    if (itemLocation[target] === "player") {
      return {
        ...payload,
        gameState: {
          ...gameState,
          storyLine: [
            ...gameState.storyLine,
            itemRegistry.getExamineDescription(target),
          ],
        },
        aborted: true,
      };
    } else if (itemLocation[target] === currentRoom) {
      return {
        ...payload,
        gameState: {
          ...gameState,
          storyLine: [
            ...gameState.storyLine,
            itemRegistry.getFloorDescription(target),
          ],
        },
        aborted: true,
      };
    } else {
      return {
        ...payload,
        gameState: {
          ...gameState,
          storyLine: [...gameState.storyLine, "You don't see that here!"],
        },
        aborted: true,
      };
    }
  }
  return payload;
};

const lookDrogo: PipelineFunction = (payload) => {
  return payload;
};

const lookPuzzleNPC: PipelineFunction = (payload) => {
  return payload;
};

const lookBath: PipelineFunction = (payload) => {
  return payload;
};

const lookPipline = [
  lookRoom,
  lookKey,
  lookItem,
  lookDrogo,
  lookPuzzleNPC,
  lookBath,
];

export const handleLook: HandleCommand = (args) => {
  const { command, target, gameState } = args;

  const payload: CommandPayload = {
    command,
    gameState,
    target,
    aborted: false,
  };

  const finalPayload = lookPipline.reduce((curPayload, curFunction) => {
    return curPayload.aborted ? curPayload : curFunction(curPayload);
  }, payload);

  return finalPayload.gameState;
};
