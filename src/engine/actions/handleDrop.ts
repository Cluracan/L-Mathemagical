import { produce } from "immer";
import { itemRegistry } from "../world/itemRegistry";
import { failCommand } from "../pipeline/failCommand";
import { isItemId } from "../../assets/data/itemData";
import { withPipeline } from "../pipeline/withPipeline";
import { runRingTriggers } from "../events/runRingTriggers";
import { runKeyConversion } from "../events/runKeyConversion";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";
import type { PipelineFunction } from "../pipeline/types";
import type { HandleCommand } from "../dispatchCommand";
import { runGuardRoomTriggers } from "../events/runGuardRoomTriggers";

// Narrative Content
const dropFeedback = {
  noTarget: "Drop what?",
  notOnPlayer: "You don't have that!",
};

const dropItem: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;

  if (!target || !isItemId(target)) {
    return failCommand(payload, dropFeedback.noTarget);
  }
  if (itemLocation[target] !== "player") {
    return failCommand(payload, dropFeedback.notOnPlayer);
  }

  return produce(payload, (draft) => {
    draft.gameState.itemLocation[target] = currentRoom;
    draft.gameState.storyLine.push(itemRegistry.getDropDescription(target));
    draft.done = true;
  });
};

const dropPipeline = [
  runKeyConversion,
  runPuzzleTriggers,
  runGuardRoomTriggers,
  runRingTriggers,
  dropItem,
];

export const handleDrop: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const payload = {
    command,
    target,
    gameState,
    done: false,
  };

  return withPipeline(payload, dropPipeline);
};
