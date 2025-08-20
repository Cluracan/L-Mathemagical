import {
  blockedExitData,
  isBlockedRoom,
} from "../../assets/data/blockedExitData";
import { isItemId, keyList } from "../../assets/data/itemData";
import { itemRegistry } from "../world/itemRegistry";
import type {
  CommandPayload,
  HandleCommand,
  PipelineFunction,
} from "./dispatchCommand";

const runUseKeyCheck: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation, storyLine, keyLocked, currentRoom } = gameState;
  //If there is a door to lock/unlock...
  const requiredKey =
    isBlockedRoom(currentRoom) && blockedExitData[currentRoom].keyRequired;
  //...and if player wants and is able to do so
  if (
    requiredKey &&
    (target === requiredKey || target === "key") &&
    itemLocation[requiredKey] === "player"
  ) {
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
  }
  //else convert 'key' to itemId if carried
  if (target === "key") {
    return {
      ...payload,
      target:
        keyList.find(
          (keyId) => isItemId(keyId) && itemLocation[keyId] === "player"
        ) || "key",
    };
  }
  return payload;
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

const UsePipeline = [runUseKeyCheck, runUseFailureMessage];

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
  return { gameState: finalPayload.gameState, command, target };
};
