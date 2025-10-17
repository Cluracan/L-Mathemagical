import { produce } from "immer";
import { isItemId } from "../../assets/data/itemData";
import { roomRegistry } from "../world/roomRegistry";
import { itemRegistry } from "../world/itemRegistry";
import { runKeyConversion } from "../events/runKeyConversion";
import { runPoolTriggers } from "../events/runPoolTriggers";
import { runBathTriggers } from "../events/runBathTriggers";
import { stopWithSuccess } from "../pipeline/stopWithSuccess";
import { failCommand } from "../pipeline/failCommand";
import { withPipeline } from "../pipeline/withPipeline";
import { getPuzzleNPCDescription } from "../puzzles/addPuzzleNPC";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";
import type { GameState } from "../gameEngine";
import type { Command, HandleCommand } from "../dispatchCommand";
import type { PipelineFunction, PipelinePayload } from "../pipeline/types";
import {
  getDrogoDescription,
  runDrogoTriggers,
} from "../events/runDrogoTriggers";
import { runAtticTriggers } from "../events/runAtticTriggers";
import { buildRoomDescription } from "../utils/buildRoomDescription";

//Helpers

const lookRoom: PipelineFunction = (payload) => {
  if (payload.target === null) {
    return produce(payload, (draft) => {
      const roomDescription = buildRoomDescription(draft.gameState, "look");
      draft.gameState.storyLine.push(...roomDescription);
      draft.done = true;
    });
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
        itemRegistry.getExamineDescription(target)
      );
    } else if (itemLocation[target] === currentRoom) {
      return stopWithSuccess(payload, itemRegistry.getFloorDescription(target));
    }
  }
  return failCommand(payload, "You don't see that here!");
};

const lookPipeline = [
  runKeyConversion,
  runPuzzleTriggers,
  runBathTriggers,
  runPoolTriggers,
  runAtticTriggers,
  runDrogoTriggers,
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
