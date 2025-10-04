import { produce } from "immer";
import { isItemId } from "../../assets/data/itemData";
import { runKeyConversion } from "../events/runKeyConversion";
import { runRingTriggers } from "../events/runRingTriggers";
import { itemRegistry } from "../world/itemRegistry";
import { failCommand } from "../pipeline/failCommand";
import type { HandleCommand } from "../dispatchCommand";
import type { PipelineFunction } from "../pipeline/types";
import { withPipeline } from "../pipeline/withPipeline";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";

const getItem: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;

  if (!target) {
    return failCommand(payload, "Get what?");
  }

  if (!isItemId(target) || itemLocation[target] !== currentRoom) {
    return failCommand(payload, "You don't see that here!");
  }

  const nextGameState = produce(gameState, (draft) => {
    draft.itemLocation[target] = "player";
    draft.storyLine.push(itemRegistry.getPickUpDescription(target));
  });
  return { ...payload, gameState: nextGameState, done: true };
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
