import { isItemId } from "../../assets/data/itemData";
import { runGetTriggers } from "../events/runGetTriggers";
import { itemRegistry } from "../world/itemRegistry";
import type { HandleCommand, PipelineFunction } from "./dispatchCommand";

const getItem: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { storyLine, itemLocation, currentRoom } = gameState;
  if (target && isItemId(target) && itemLocation[target] === currentRoom) {
    return {
      ...payload,
      gameState: {
        ...gameState,
        itemLocation: { ...itemLocation, [target]: "player" },
        storyLine: [
          ...storyLine,
          `You pick up the ${itemRegistry.getPickUpDescription(target)}`,
        ],
      },
      aborted: true,
    };
  } else {
    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [...storyLine, `You don't see that here!`],
      },
      aborted: true,
    };
  }
};

const getPipeline = [runGetTriggers, getItem];

export const handleGet: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const payload = {
    command,
    gameState,
    target,
    aborted: false,
  };

  const finalPayload = getPipeline.reduce((curPayload, curFunction) => {
    return curPayload.aborted ? curPayload : curFunction(curPayload);
  }, payload);
  return finalPayload.gameState;
};
