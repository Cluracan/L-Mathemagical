import { produce } from "immer";
import type { HandleCommand } from "../dispatchCommand";
import type { PipelineFunction, PipelinePayload } from "../pipeline/types";
import { withPipeline } from "../pipeline/withPipeline";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";
import type { GameState } from "../gameEngine";

// Note: Currently no items to budge outside of events/puzzleTriggers

// Narrative Content
const failureFeedback = {
  noTarget: "What would you like to move?",
  noEffect: "You decide that would not be helpful...",
};

const chestFeedback = {
  canMove:
    "The chest has been moved to reveal a trap door in the floor. A ladder leads down into a cellar.",
  cannotMove: "The chest doesn't seem to move.",
};

// Helpers
const playerHasItems = (gameState: GameState) => {
  const inventoryCount = Object.values(gameState.itemLocation).filter(
    (location) => location === "player"
  ).length;
  return inventoryCount > 0;
};

const runChestTriggers: PipelineFunction = (payload) => {
  if (payload.target !== "chest") {
    return payload;
  }
  return produce(payload, (draft) => {
    if (playerHasItems(draft.gameState)) {
      draft.gameState.storyLine.push(chestFeedback.cannotMove);
    } else {
      draft.gameState.keyLocked.chest = false;
      draft.gameState.storyLine.push(chestFeedback.canMove);
    }
    draft.done = true;
  });
};

const runFailureMessage: PipelineFunction = (payload) => {
  return produce(payload, (draft) => {
    draft.gameState.storyLine.push(
      draft.target ? failureFeedback.noEffect : failureFeedback.noTarget
    );
  });
};

const budgePipeline = [runPuzzleTriggers, runChestTriggers, runFailureMessage];

export const handleBudge: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const payload: PipelinePayload = {
    command,
    target,
    gameState,
    done: false,
  };

  return withPipeline(payload, budgePipeline);
};
