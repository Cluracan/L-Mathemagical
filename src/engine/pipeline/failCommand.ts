import { produce } from "immer";
import type { PipelinePayload } from "./types";

export const failCommand = (
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
