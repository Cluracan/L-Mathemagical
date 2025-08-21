import {
  blockedExitData,
  isBlockedRoom,
} from "../../assets/data/blockedExitData";
import { isItemId, isKeyType, keyList } from "../../assets/data/itemData";
import { runKeyConversion } from "../events/runKeyConversion";
import { itemRegistry } from "../world/itemRegistry";
import type {
  CommandPayload,
  HandleCommand,
  PipelineFunction,
} from "./dispatchCommand";

const runUseKeyCheck: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation, storyLine, keyLocked, currentRoom } = gameState;

  const requiredKey =
    isBlockedRoom(currentRoom) && blockedExitData[currentRoom].keyRequired;

  if (!requiredKey || !target || !isKeyType(target)) {
    return payload;
  }

  if (itemLocation[requiredKey] !== "player") {
    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [...storyLine, "You don't have the right key!"],
      },
      aborted: true,
    };
  }

  if (target === requiredKey) {
    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [
          ...storyLine,
          keyLocked[requiredKey]
            ? "You unlock and open the door"
            : "You lock and close the door",
        ],
        keyLocked: { ...keyLocked, [requiredKey]: !keyLocked[requiredKey] },
      },
      aborted: true,
    };
  } else {
    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [...storyLine, "That's the wrong key!"],
      },
      aborted: true,
    };
  }
};

const runUseFailureMessage: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { storyLine, itemLocation } = gameState;
  if (target === null) {
    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [...storyLine, "Use what?"],
      },
      aborted: true,
    };
  }

  if (isItemId(target) && itemLocation[target] === "player") {
    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [
          ...storyLine,
          `You can't use ${isItemId(target) ? `the ${itemRegistry.getPickUpDescription(target)}` : "that"} here...`,
        ],
      },
      aborted: true,
    };
  } else {
    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [...storyLine, "You don't have that!"],
      },
      aborted: true,
    };
  }
};

const UsePipeline = [runKeyConversion, runUseKeyCheck, runUseFailureMessage];

export const handleUse: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const payload: CommandPayload = {
    command,
    gameState,
    target,
    aborted: false,
  };

  const finalPayload = UsePipeline.reduce((curPayload, curFunction) => {
    return curPayload.aborted ? curPayload : curFunction(curPayload);
  }, payload);
  return finalPayload.gameState;
};
