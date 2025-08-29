import { produce } from "immer";
import type { PipelinePayload } from "../pipeline/types";

export const failCommand = (
  payload: PipelinePayload,
  storyLineMessage: string,
  feedback: string
): PipelinePayload => {
  const { gameState } = payload;
  const nextGameState = produce(gameState, (draft) => {
    draft.storyLine.push(storyLineMessage);
    draft.success = false;
    draft.feedback = feedback;
  });
  return {
    ...payload,
    gameState: nextGameState,
    done: true,
  };
};
