import { produce } from "immer";
import type { CommandPayload } from "../dispatchCommand";

export const stopWithSuccess = (
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
    done: true,
  };
};
