import type { GameState } from "../gameEngine";
import type { PipelineFunction, PipelinePayload } from "./types";

export const withPipeline = (
  payload: PipelinePayload,
  pipelineFunctions: PipelineFunction[]
): GameState => {
  const finalPayload = pipelineFunctions.reduce(
    (curPayload, curFunction) =>
      curPayload.done ? curPayload : curFunction(curPayload),
    payload
  );
  return finalPayload.gameState;
};
