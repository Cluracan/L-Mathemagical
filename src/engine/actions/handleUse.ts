import { produce } from "immer";
import {
  blockedExitData,
  isBlockedRoom,
} from "../../assets/data/blockedExitData";
import { isItemId, isKeyType } from "../../assets/data/itemData";
import { runBathTriggers } from "../events/runBathTriggers";
import { runKeyConversion } from "../events/runKeyConversion";
import { failCommand } from "../utils/abortWithCommandFailure";

import type { HandleCommand } from "../dispatchCommand";
import type { PipelineFunction, PipelinePayload } from "../pipeline/types";
import { withPipeline } from "../pipeline/withPipeline";

const keyFeedback = {
  noKey: "You don't have the right key!",
  wrongKey: "That's the wrong key!",
  lockDoor: "You lock and close the door",
  unlockDoor: "You unlock and open the door",
} as const;

const useFeedback = {
  noTarget: "Use what?",
  noUse: "You can't use that here...",
  notOnPlayer: "You don't have that!",
} as const;

const runUseKeyCheck: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;

  const requiredKey =
    isBlockedRoom(currentRoom) && blockedExitData[currentRoom].keyRequired;

  if (!requiredKey || !target || !isKeyType(target)) return payload;

  if (itemLocation[requiredKey] !== "player") {
    return failCommand(payload, keyFeedback.noKey, "no key");
  }

  if (target === requiredKey) {
    const nextGameState = produce(gameState, (draft) => {
      draft.keyLocked[requiredKey] = !draft.keyLocked[requiredKey];
      draft.storyLine.push(
        draft.keyLocked[requiredKey]
          ? keyFeedback.lockDoor
          : keyFeedback.unlockDoor
      );
    });

    return {
      ...payload,
      gameState: nextGameState,
      done: true,
    };
  } else {
    return failCommand(payload, keyFeedback.wrongKey, "wrong key");
  }
};

const runUseFailureMessage: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation } = gameState;
  /*
  const useItemChecks = [
    {
      check: () => target === null,
      action: () => failCommand(payload, useFeedback.noTarget, "no target"),
    },
    {
      check: () => isItemId(target!) && itemLocation[target] === "player",
      action: () =>
        failCommand(payload, useFeedback.noUse, "no use in currentRoom"),
    },
  ];
  for (const { check, action } of useItemChecks) {
    if (check()) return action();
  }
*/

  if (target === null) {
    return failCommand(payload, useFeedback.noTarget, "no target");
  }

  if (isItemId(target) && itemLocation[target] === "player") {
    return failCommand(payload, useFeedback.noUse, "no use in currentRoom");
  } else {
    return failCommand(
      payload,
      useFeedback.notOnPlayer,
      "target not item || not on player"
    );
  }
};

const UsePipeline = [
  runBathTriggers,
  runKeyConversion,
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

  return withPipeline(payload, UsePipeline).gameState;
};
