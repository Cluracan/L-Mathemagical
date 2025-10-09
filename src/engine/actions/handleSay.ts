import type { HandleCommand } from "../dispatchCommand";
import type { PipelineFunction, PipelinePayload } from "../pipeline/types";
import { withPipeline } from "../pipeline/withPipeline";
import { runPuzzleTriggers } from "../puzzles/runPuzzleTriggers";

const sayTarget: PipelineFunction = (payload) => {
  console.log(`saying ${payload.target}`);
  return payload;
};

const sayPipeline: PipelineFunction[] = [runPuzzleTriggers, sayTarget];
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
