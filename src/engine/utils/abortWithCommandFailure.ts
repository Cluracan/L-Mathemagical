import { produce } from "immer";
import type { CommandPayload } from "../actions/dispatchCommand";

export const failCommand = (
  payload: CommandPayload,
  storyLineMessage: string,
  feedback: string
): CommandPayload => {
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
