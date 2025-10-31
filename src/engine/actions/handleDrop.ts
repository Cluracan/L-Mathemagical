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
import { runAmuletTriggers } from "../events/runAmuletTriggers";

// Narrative Content
const dropFeedback = {
  noTarget: "Drop what?",
  notOnPlayer: "You don't have that!",
};

const dropItem: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;

  if (!target || !isItemId(target)) {
    return failCommand({
      payload,
      text: dropFeedback.noTarget,
      type: "warning",
    });
  }
  if (itemLocation[target] !== "player") {
    return failCommand({
      payload,
      text: dropFeedback.notOnPlayer,
      type: "warning",
    });
  }

  return produce(payload, (draft) => {
    draft.gameState.itemLocation[target] = currentRoom;
    draft.gameState.storyLine.push({
      type: "warning",
      text: itemRegistry.getDropDescription(target),
      isEncrypted: draft.gameState.encryptionActive,
    });
    draft.done = true;
  });
};

const dropPipeline = [
  runKeyConversion,
  runPuzzleTriggers,
  runGuardRoomTriggers,
  runRingTriggers,
  runAmuletTriggers,
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
