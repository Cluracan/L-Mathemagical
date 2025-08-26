import { produce } from "immer";
import { isItemId } from "../../assets/data/itemData";
import { runKeyConversion } from "../events/runKeyConversion";
import { runRingTriggers } from "../events/runRingTriggers";
import { itemRegistry } from "../world/itemRegistry";
import type { HandleCommand, PipelineFunction } from "./dispatchCommand";
import { abortWithCommandFailure } from "../utils/abortWithCommandFailure";

const getItem: PipelineFunction = (payload) => {
  const { target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;

  if (!target) {
    return abortWithCommandFailure(payload, "Get what?", "no target");
  }

  if (!isItemId(target) || itemLocation[target] !== currentRoom) {
    return abortWithCommandFailure(
      payload,
      "You don't see that here!",
      "target !==itemId || itemId not in location"
    );
  }

  if (isItemId(target) && itemLocation[target] === currentRoom) {
    const nextGameState = produce(gameState, (draft) => {
      draft.itemLocation[target] = "player";
      draft.storyLine.push(itemRegistry.getPickUpDescription(target));
    });
    return { ...payload, gameState: nextGameState, aborted: true };
  }

  return {
    ...payload,
    gameState: { ...gameState, success: false, feedback: "ERROR in getItem" },
  };
};

const getPipeline = [runKeyConversion, runRingTriggers, getItem];

export const handleGet: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const payload = {
    command,
    gameState,
    target,
    aborted: false,
  };

  const finalPayload = getPipeline.reduce((curPayload, curFunction) => {
    console.log(curFunction);
    return curPayload.aborted ? curPayload : curFunction(curPayload);
  }, payload);
  return finalPayload.gameState;
};
