import { roomRegistry } from "../world/roomRegistry";
import { itemRegistry } from "../world/itemRegistry";
import { isItemId } from "../../assets/data/itemData";
import { runKeyConversion } from "../events/runKeyConversion";
import { runPoolTriggers } from "../events/runPoolTriggers";
import { runBathTriggers } from "../events/runBathTriggers";
import type { GameState } from "../gameEngine";
import type {
  Command,
  CommandPayload,
  HandleCommand,
  PipelineFunction,
} from "./dispatchCommand";
import { produce } from "immer";
import { stopWithSuccess } from "../utils/abortWithCommandSuccess";
import { failCommand } from "../utils/abortWithCommandFailure";

//Helper functions
export const buildRoomDescription = (
  gameState: GameState,
  command: Command
) => {
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
    const roomDescription = buildRoomDescription(payload.gameState, "look");
    const nextGameState = produce(payload.gameState, (draft) => {
      draft.storyLine.push(...roomDescription);
    });
    return {
      ...payload,
      gameState: nextGameState,
      done: true,
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
      return stopWithSuccess(
        payload,
        itemRegistry.getInventoryDescription(target)
      );
    } else if (itemLocation[target] === currentRoom) {
      return stopWithSuccess(payload, itemRegistry.getFloorDescription(target));
    }
  }
  return failCommand(payload, "You don't see that here!", "target not visible");
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
  runBathTriggers,
  runKeyConversion,
  runPoolTriggers,
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
    done: false,
  };

  const finalPayload = lookPipline.reduce((curPayload, curFunction) => {
    return curPayload.done ? curPayload : curFunction(curPayload);
  }, payload);

  return finalPayload.gameState;
};
