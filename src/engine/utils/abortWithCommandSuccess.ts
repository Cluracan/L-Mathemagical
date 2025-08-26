import { produce } from "immer";
import type { CommandPayload } from "../actions/dispatchCommand";

export const abortWithCommandSuccess = (
  payload: CommandPayload,
  storyLineMessage: string
): CommandPayload => {
  const { gameState } = payload;
  const nextGameState = produce(gameState, (draft) => {
    draft.storyLine.push(storyLineMessage);
  });
  return {
    ...payload,
    gameState: nextGameState,
    aborted: true,
  };
};
