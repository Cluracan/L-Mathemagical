import { produce } from "immer";
import {
  blockedExitData,
  isBlockedRoom,
} from "../../assets/data/blockedExitData";
import { runBathTriggers } from "../events/runBathTriggers";
import { runKeyConversion } from "../events/runKeyConversion";
import { failCommand } from "../pipeline/failCommand";
import { withPipeline } from "../pipeline/withPipeline";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";
import { isItemId, isKeyType } from "../../assets/data/itemData";
import type { PipelineFunction, PipelinePayload } from "../pipeline/types";
import type { HandleCommand } from "../dispatchCommand";
import { runCellRoomTriggers } from "../events/runCellRoomTriggers";

// Narrative Content
const keyFeedback = {
  noKey: "You don't have the right key!",
  wrongKey: "That's the wrong key!",
  lockDoor: "You lock and close the door",
  unlockDoor: "You unlock and open the door",
} as const;

export const useFeedback = {
  noTarget: "What would you like to use?",
  notAnItem: "Use what?",
  cannotUseHere: "You can't use that here...",
  notOnPlayer: "You don't have that!",
} as const;

const runUseKeyCheck: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;

  const requiredKey =
    isBlockedRoom(currentRoom) && blockedExitData[currentRoom].keyRequired;

  if (!requiredKey || !target || !isKeyType(target)||itemLocation[target]!=="player") return payload;

  if (itemLocation[requiredKey] !== "player") {
    return failCommand(payload, keyFeedback.noKey);
  }

  if (target === requiredKey) {
    return produce(payload, (draft) => {
      draft.gameState.keyLocked[requiredKey] =
        !draft.gameState.keyLocked[requiredKey];
      draft.gameState.storyLine.push(
        draft.gameState.keyLocked[requiredKey]
          ? keyFeedback.lockDoor
          : keyFeedback.unlockDoor
      );
      draft.done = true;
    });
  } else {
    return failCommand(payload, keyFeedback.wrongKey);
  }
};

const runUseFailureMessage: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation } = gameState;

  if (target === null) {
    return failCommand(payload, useFeedback.noTarget);
  }
  if (!isItemId(target)) {
    return failCommand(payload, useFeedback.notAnItem);
  }
  if (itemLocation[target] !== "player") {
    return failCommand(payload, useFeedback.notOnPlayer);
  }
  return failCommand(payload, useFeedback.cannotUseHere);
};

const usePipeline = [
  runKeyConversion,
  runPuzzleTriggers,
  runBathTriggers,
  runCellRoomTriggers,
  runUseKeyCheck,
  runUseFailureMessage,
];

export const handleUse: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const payload: PipelinePayload = {
    command,
    gameState,
    target,
    done: false,
  };

  return withPipeline(payload, usePipeline);
};
