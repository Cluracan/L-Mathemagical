import { produce } from "immer";
import { isItemId } from "../../assets/data/itemData";
import { runKeyConversion } from "../events/runKeyConversion";
import { runRingTriggers } from "../events/runRingTriggers";
import { itemRegistry } from "../world/itemRegistry";
import type { HandleCommand, PipelineFunction } from "./dispatchCommand";
import { abortWithCommandFailure } from "../utils/abortWithCommandFailure";

const dropItem: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;

  if (!target) {
    return abortWithCommandFailure(payload, "Drop what?", "no target");
  }

  if (!isItemId(target) || itemLocation[target] !== "player") {
    return abortWithCommandFailure(
      payload,
      "You don't have that!",
      "itemId not on player"
    );
  }
  if (target && isItemId(target) && itemLocation[target] === "player") {
    const nextGameState = produce(gameState, (draft) => {
      draft.itemLocation[target] = currentRoom;
      draft.storyLine.push(itemRegistry.getDropDescription(target));
    });
    return {
      ...payload,
      gameState: nextGameState,
      aborted: true,
    };
  }

  return {
    ...payload,
    gameState: { ...gameState, success: false, feedback: "ERROR in dropItem" },
  };
};

const dropPipeline = [runKeyConversion, runRingTriggers, dropItem];

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
