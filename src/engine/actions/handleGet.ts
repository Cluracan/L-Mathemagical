import { produce } from "immer";
import { isItemId } from "../../assets/data/itemData";
import { runKeyConversion } from "../events/runKeyConversion";
import { runRingTriggers } from "../events/runRingTriggers";
import { itemRegistry } from "../world/itemRegistry";
import { failCommand } from "../pipeline/failCommand";
import { withPipeline } from "../pipeline/withPipeline";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";
import type { HandleCommand } from "../dispatchCommand";
import type { PipelineFunction } from "../pipeline/types";

// Narrative Content
const getFeedback = {
  noTarget: "Get what?",
  notInRoom: "You don't see that here!",
};

const getItem: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;

  if (!target || !isItemId(target)) {
    return failCommand(payload, getFeedback.noTarget);
  }

  if (itemLocation[target] !== currentRoom) {
    return failCommand(payload, getFeedback.notInRoom);
  }

  return produce(payload, (draft) => {
    draft.gameState.itemLocation[target] = "player";
    draft.gameState.storyLine.push(itemRegistry.getPickUpDescription(target));
  });
};

const getPipeline = [
  runPuzzleTriggers,
  runKeyConversion,
  runRingTriggers,
  getItem,
];

export const handleGet: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const payload = {
    command,
    gameState,
    target,
    done: false,
  };

  return withPipeline(payload, getPipeline);
};
