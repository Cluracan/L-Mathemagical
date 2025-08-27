import { produce } from "immer";
import { isItemId } from "../../assets/data/itemData";
import { runKeyConversion } from "../events/runKeyConversion";
import { runRingTriggers } from "../events/runRingTriggers";
import { itemRegistry } from "../world/itemRegistry";
import type { HandleCommand, PipelineFunction } from "./dispatchCommand";
import { failCommand } from "../utils/abortWithCommandFailure";

const dropItem: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;

  if (!target) {
    return failCommand(payload, "Drop what?", "no target");
  }
  if (!isItemId(target) || itemLocation[target] !== "player") {
    return failCommand(payload, "You don't have that!", "itemId not on player");
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

  const finalPayload = dropPipeline.reduce((curPayload, curFunction) => {
    return curPayload.done ? curPayload : curFunction(curPayload);
  }, payload);

  return finalPayload.gameState;
};
