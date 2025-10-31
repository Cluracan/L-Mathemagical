import { produce } from "immer";
import { isItemId } from "../../assets/data/itemData";
import { itemRegistry } from "../world/itemRegistry";
import { withPipeline } from "../pipeline/withPipeline";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";
import type { HandleCommand } from "../dispatchCommand";
import type { PipelineFunction, PipelinePayload } from "../pipeline/types";

// Narrative Content
const failureFeedback = {
  noTarget: "Drink what?",
  notOnPlayer: "You don't have that...",
  notDrinkable: "You can't drink that!",
};

const runHeightPotionCheck: PipelineFunction = (payload) => {
  if (payload.target !== "bottle" && payload.target !== "phial") {
    return payload;
  }
  const potion = payload.target;
  return produce(payload, (draft) => {
    const playerHeight = draft.gameState.playerHeight;
    draft.gameState.storyLine.push({
      type: "action",
      text: itemRegistry.getDrinkMessage(potion, playerHeight),
      isEncrypted: draft.gameState.encryptionActive,
    });
    draft.gameState.playerHeight = itemRegistry.getNewHeight(
      potion,
      playerHeight
    );
    draft.gameState.itemLocation[potion] = "pit";
    draft.done = true;
  });
};

const runFailureMessage: PipelineFunction = (payload) => {
  return produce(payload, (draft) => {
    const storyLine = draft.gameState.storyLine;
    const target = draft.target;
    if (!target || !isItemId(target)) {
      storyLine.push({
        type: "warning",
        text: failureFeedback.noTarget,
        isEncrypted: draft.gameState.encryptionActive,
      });
    } else if (draft.gameState.itemLocation[target] !== "player") {
      storyLine.push({
        type: "warning",
        text: failureFeedback.notOnPlayer,
        isEncrypted: draft.gameState.encryptionActive,
      });
    } else {
      storyLine.push({
        type: "warning",
        text: failureFeedback.notDrinkable,
        isEncrypted: draft.gameState.encryptionActive,
      });
    }
  });
};

const drinkPipeline = [
  runPuzzleTriggers,
  runHeightPotionCheck,
  runFailureMessage,
];

export const handleDrink: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const payload: PipelinePayload = {
    command,
    target,
    gameState,
    done: false,
  };

  return withPipeline(payload, drinkPipeline);
};
