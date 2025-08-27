import { produce } from "immer";
import {
  blockedExitData,
  isBlockedRoom,
} from "../../assets/data/blockedExitData";
import { isItemId, isKeyType } from "../../assets/data/itemData";
import { runBathTriggers } from "../events/runBathTriggers";
import { runKeyConversion } from "../events/runKeyConversion";
import { failCommand } from "../utils/abortWithCommandFailure";

import type {
  CommandPayload,
  HandleCommand,
  PipelineFunction,
} from "./dispatchCommand";

const runUseKeyCheck: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;

  const requiredKey =
    isBlockedRoom(currentRoom) && blockedExitData[currentRoom].keyRequired;

  if (!requiredKey || !target || !isKeyType(target)) {
    return {
      ...payload,
      gameState: {
        ...gameState,
        success: false,
        feedback: "no target || target !== key || no lockable door",
      },
    };
  }

  if (itemLocation[requiredKey] !== "player") {
    return failCommand(payload, "You don't have the right key!", "no key");
  }

  if (target === requiredKey) {
    const nextGameState = produce(gameState, (draft) => {
      draft.keyLocked[requiredKey] = !draft.keyLocked[requiredKey];
      draft.storyLine.push(
        draft.keyLocked[requiredKey]
          ? "You lock and close the door"
          : "You unlock and open the door"
      );
    });

    return {
      ...payload,
      gameState: nextGameState,
      done: true,
    };
  } else {
    return failCommand(payload, "That's the wrong key!", "wrong key");
  }
};

const runUseFailureMessage: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation } = gameState;
  if (target === null) {
    return failCommand(payload, "Use what?", "no target");
  }

  if (isItemId(target) && itemLocation[target] === "player") {
    return failCommand(
      payload,
      "You can't use that here...",
      "no use in currentRoom"
    );
  } else {
    return failCommand(
      payload,
      "You don't have that!",
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
  const payload: CommandPayload = {
    command,
    gameState,
    target,
    done: false,
  };

  const finalPayload = UsePipeline.reduce((curPayload, curFunction) => {
    return curPayload.done ? curPayload : curFunction(curPayload);
  }, payload);
  return finalPayload.gameState;
};
