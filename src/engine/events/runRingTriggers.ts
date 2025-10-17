import { produce } from "immer";
import type { PipelineFunction } from "../pipeline/types";

export const ringFeedback = {
  drop: "As you drop the ring, you sense a great magical power blast through you. You see yourself fade back into view.",
  get: "As you pick up the ring, you sense a great magical power blast through you.  The ring has made you, and everything you are carrying invisible.",
} as const;

export const runRingTriggers: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  const { itemLocation, currentRoom } = gameState;
  if (target === "ring") {
    switch (command) {
      case "drop":
        if (itemLocation[target] === "player") {
          return produce(payload, (draft) => {
            draft.gameState.isInvisible = false;
            draft.gameState.storyLine.push(ringFeedback.drop);
            draft.gameState.itemLocation[target] = currentRoom;
            draft.done = true;
          });
        }
        break;
      case "get":
        if (itemLocation[target] === currentRoom) {
          return produce(payload, (draft) => {
            draft.gameState.isInvisible = true;
            draft.gameState.storyLine.push(ringFeedback.get);
            draft.gameState.itemLocation[target] = "player";
            draft.done = true;
          });
        }
        break;
      default:
        return payload;
    }
  }
  return payload;
};
