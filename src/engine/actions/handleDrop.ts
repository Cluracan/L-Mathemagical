import { produce } from "immer";
import { isItemId } from "../../assets/data/itemData";
import { runKeyConversion } from "../events/runKeyConversion";
import { runRingTriggers } from "../events/runRingTriggers";
import { itemRegistry } from "../world/itemRegistry";
import { failCommand } from "../pipeline/failCommand";
import type { HandleCommand } from "../dispatchCommand";
import type { PipelineFunction } from "../pipeline/types";
import { withPipeline } from "../pipeline/withPipeline";

const dropItem: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;

  if (!target) {
    return failCommand(payload, "Drop what?");
  }
  if (!isItemId(target) || itemLocation[target] !== "player") {
    return failCommand(payload, "You don't have that!");
  }
  if (target && isItemId(target) && itemLocation[target] === "player") {
    const nextGameState = produce(gameState, (draft) => {
      draft.itemLocation[target] = currentRoom;
      draft.storyLine.push(itemRegistry.getDropDescription(target));
    });
    return {
      ...payload,
      gameState: nextGameState,
      done: true,
    };
  }

  throw new Error("Unexpected code path in dropItem");
};

const dropPipeline = [runKeyConversion, runRingTriggers, dropItem];

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
