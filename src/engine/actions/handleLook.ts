import { roomRegistry } from "../world/roomRegistry";
import { itemRegistry } from "../world/itemRegistry";
import { isItemId } from "../../assets/data/itemData";
import type { GameState } from "../gameEngine";
import type {
  Command,
  CommandPayload,
  HandleCommand,
  PipelineFunction,
} from "./dispatchCommand";
import { runKeyConversion } from "../events/runKeyConversion";
import { runPoolTriggers } from "../events/runPoolTriggers";

//Helper function
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
  console.log(payload.target);
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
          success: false,
          feedback: "target not visible",
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
  runPoolTriggers,
  runKeyConversion,
  lookRoom,
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
