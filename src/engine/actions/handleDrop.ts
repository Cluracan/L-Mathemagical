import { isItemId } from "../../assets/data/itemData";
import { runDropTriggers } from "../events/runDropTriggers";
import type { GameState } from "../gameEngine";
import { itemRegistry } from "../world/itemRegistry";
import type { HandleCommand } from "./dispatchCommand";

type DropPayload = {
  target: string | null;
  gameState: GameState;
  aborted: boolean;
};

export type DropPipelineFunction = (args: DropPayload) => DropPayload;

const dropItem: DropPipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { storyLine, itemLocation, currentRoom } = gameState;
  if (target && isItemId(target) && itemLocation[target] === "player") {
    return {
      ...payload,
      gameState: {
        ...gameState,
        itemLocation: { ...itemLocation, [target]: currentRoom },
        storyLine: [
          ...storyLine,
          `You drop the ${itemRegistry.getPickUpDescription(target)}`,
        ],
      },
      aborted: true,
    };
  } else {
    return {
      ...payload,
      gameState: {
        ...gameState,
        storyLine: [...storyLine, `You don't have that!`],
      },
      aborted: true,
    };
  }
};

const dropPipeline = [runDropTriggers, dropItem];

export const handleDrop: HandleCommand = ({ target, gameState }) => {
  const payload: DropPayload = {
    gameState,
    target,
    aborted: false,
  };

  const finalPayload = dropPipeline.reduce((curPayload, curFunction) => {
    return curPayload.aborted ? curPayload : curFunction(curPayload);
  }, payload);
  return finalPayload.gameState;
};
