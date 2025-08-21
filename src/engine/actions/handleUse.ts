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
    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [...storyLine, "You don't have the right key!"],
        success: false,
        feedback: "requiredKey not on player",
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
        success: false,
        feedback: "target !== requiredKey (wrong key choice from inv)",
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
        success: false,
        feedback: "no target",
      },
      aborted: true,
    };
  }

  if (isItemId(target) && itemLocation[target] === "player") {
    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [...storyLine, `You can't use that here...`],
        success: false,
        feedback: "no use in currentRoom",
      },
      aborted: true,
    };
  } else {
    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [...storyLine, "You don't have that!"],
        success: false,
        feedback: "target not item || not on player",
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
