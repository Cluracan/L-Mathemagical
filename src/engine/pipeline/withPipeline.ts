import type { PipelineFunction, PipelinePayload } from "./types";

export const withPipeline = (
  payload: PipelinePayload,
  pipelineFunctions: PipelineFunction[]
): PipelinePayload => {
  return pipelineFunctions.reduce(
    (curPayload, curFunction) =>
      curPayload.done ? curPayload : curFunction(curPayload),
    payload
  );
};
