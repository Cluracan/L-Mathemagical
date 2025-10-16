import { produce } from "immer";
import type { HandleCommand } from "../dispatchCommand";
import type { PipelineFunction, PipelinePayload } from "../pipeline/types";
import { withPipeline } from "../pipeline/withPipeline";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";
import { runDrogoTriggers } from "../events/runDrogoTriggers";

// Narrative Content
const sayMessages = [
  "Your words have no effect.",
  "You cast your thoughts out into the room...",
  "You speak out loud, but noone appears to notice.",
];

const sayTarget: PipelineFunction = (payload) => {
  const rngIndex = Math.floor(Math.random() * sayMessages.length);
  return produce(payload, (draft) => {
    draft.gameState.storyLine.push(sayMessages[rngIndex]);
  });
};

const sayPipeline: PipelineFunction[] = [
  runPuzzleTriggers,
  runDrogoTriggers,
  sayTarget,
];

export const handleSay: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const payload: PipelinePayload = {
    command,
    gameState,
    target,
    done: false,
  };

  return withPipeline(payload, sayPipeline);
};
