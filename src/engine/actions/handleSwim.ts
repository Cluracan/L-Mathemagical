import { produce } from "immer";
import type { HandleCommand } from "../dispatchCommand";
import type { PipelineFunction, PipelinePayload } from "../pipeline/types";
import { withPipeline } from "../pipeline/withPipeline";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";
import { createKeyGuard } from "../../utils/guards";

// Narrative Content
const swimFeedback = {
  pool: "Diving into an empty swimming pool would be a bad idea.  You could always go down the steps, perhaps?",
  poolFloor:
    "Waving your arms and legs about in an empty pool will look very silly.",
  riverS:
    "As you enter the water, a pirhana fish gives you a nasty nip on your big toe. You hastily retreat to the bank.",
  riverN:
    "As you enter the water, a pirhana fish gives you a nasty nip on your little toe. You hastily retreat to the bank.",
  default: "This doesn't appear to be a good place to swim...",
} as const;
const hasSwimFeedback = createKeyGuard(swimFeedback);

export const runSwimTriggers: PipelineFunction = (payload) => {
  return produce(payload, (draft) => {
    if (hasSwimFeedback(draft.gameState.currentRoom)) {
      draft.gameState.storyLine.push({
        type: "warning",
        text: swimFeedback[draft.gameState.currentRoom],
        isEncrypted: draft.gameState.encryptionActive,
      });
    } else {
      draft.gameState.storyLine.push({
        type: "warning",
        text: swimFeedback.default,
        isEncrypted: draft.gameState.encryptionActive,
      });
    }
  });
};

const swimPipeline: PipelineFunction[] = [runPuzzleTriggers, runSwimTriggers];

export const handleSwim: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const payload: PipelinePayload = {
    command,
    gameState,
    target,
    done: false,
  };

  return withPipeline(payload, swimPipeline);
};
