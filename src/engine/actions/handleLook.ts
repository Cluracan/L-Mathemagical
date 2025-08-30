import { roomRegistry } from "../world/roomRegistry";
import { itemRegistry } from "../world/itemRegistry";
import { isItemId } from "../../assets/data/itemData";
import { runKeyConversion } from "../events/runKeyConversion";
import { runPoolTriggers } from "../events/runPoolTriggers";
import { runBathTriggers } from "../events/runBathTriggers";
import type { GameState } from "../gameEngine";
import type { Command, HandleCommand } from "../dispatchCommand";
import { produce } from "immer";
import { stopWithSuccess } from "../utils/stopWithSuccess";
import { failCommand } from "../utils/failCommand";
import type { PipelineFunction, PipelinePayload } from "../pipeline/types";
import { withPipeline } from "../pipeline/withPipeline";
import { addPuzzleNPC } from "../puzzles/addPuzzleNPC";

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
  const puzzleNPCDescription = addPuzzleNPC(gameState);
  if (puzzleNPCDescription) roomDescription.push(puzzleNPCDescription);
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
  return failCommand(payload, "You don't see that here!");
};

const lookPipeline = [
  runBathTriggers,
  runKeyConversion,
  runPoolTriggers,
  lookRoom,
  lookItem,
];

export const handleLook: HandleCommand = (args) => {
  const { command, target, gameState } = args;

  const payload: PipelinePayload = {
    command,
    gameState,
    target,
    done: false,
  };

  return withPipeline(payload, lookPipeline);
};
