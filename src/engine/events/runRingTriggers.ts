import { produce } from "immer";
import type { PipelineFunction } from "../actions/dispatchCommand";

const ringMessages = {
  drop: "As you drop the ring, you sense a great magical power blast through you. You see youself fade back into view.",
  get: "As you pick up the ring, you sense a great magical power blast through you.  The ring has made you, and everything you are carrying invisible.",
} as const;

export const runRingTriggers: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;
  if (target === "ring") {
    switch (command) {
      case "drop":
        if (itemLocation[target] === "player") {
          const nextGameState = produce(gameState, (draft) => {
            draft.isInvisible = false;
            draft.storyLine.push(ringMessages.drop);
            draft.itemLocation[target] = currentRoom;
          });
          return { ...payload, gameState: nextGameState, done: true };
        }
        break;
      case "get":
        if (itemLocation[target] === currentRoom) {
          const nextGameState = produce(gameState, (draft) => {
            draft.isInvisible = true;
            draft.storyLine.push(ringMessages.get);
            draft.itemLocation[target] = "player";
          });
          return {
            ...payload,
            gameState: nextGameState,
            done: true,
          };
        }
        break;
      default:
        return payload;
    }
  }
  return payload;
};
