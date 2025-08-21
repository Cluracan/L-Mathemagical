import { isItemId } from "../../assets/data/itemData";
import { runKeyConversion } from "../events/runKeyConversion";
import { runRingTriggers } from "../events/runRingTriggers";
import { itemRegistry } from "../world/itemRegistry";
import type { HandleCommand, PipelineFunction } from "./dispatchCommand";

const dropItem: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { storyLine, itemLocation, currentRoom } = gameState;

  if (target && isItemId(target) && itemLocation[target] === "player") {
    return {
      ...payload,
      gameState: {
        ...gameState,
        itemLocation: { ...itemLocation, [target]: currentRoom },
        storyLine: [...storyLine, itemRegistry.getDropDescription(target)],
      },
      aborted: true,
    };
  }
  return payload;
};

const runFailureChecks: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { storyLine, itemLocation } = gameState;

  if (!target) {
    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [...storyLine, "Drop what?"],
      },
      aborted: true,
    };
  }
  if (!isItemId(target) || itemLocation[target] !== "player") {
    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [...storyLine, "You don't have that!"],
      },
      aborted: true,
    };
  }
  return payload;
};

const dropPipeline = [
  runKeyConversion,
  runRingTriggers,
  dropItem,
  runFailureChecks,
];

export const handleDrop: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const payload = {
    command,
    target,
    gameState,
    aborted: false,
  };

  const finalPayload = dropPipeline.reduce((curPayload, curFunction) => {
    return curPayload.aborted ? curPayload : curFunction(curPayload);
  }, payload);

  return finalPayload.gameState;
};
