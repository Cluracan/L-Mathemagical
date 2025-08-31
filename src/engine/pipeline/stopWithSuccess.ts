import { produce } from "immer";
import type { PipelinePayload } from "../pipeline/types";

export const stopWithSuccess = (
  payload: PipelinePayload,
  storyLineMessage: string
): PipelinePayload => {
  const { gameState } = payload;
  const nextGameState = produce(gameState, (draft) => {
    draft.storyLine.push(storyLineMessage);
  });
  return {
    ...payload,
    gameState: nextGameState,
    done: true,
  };
};
