import type { PipelineFunction } from "../actions/dispatchCommand";

export const runRingTriggers: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  const { storyLine, itemLocation, currentRoom } = gameState;
  if (target === "ring") {
    switch (command) {
      case "drop":
        if (itemLocation[target] === "player") {
          return {
            ...payload,
            gameState: {
              ...gameState,
              isInvisible: false,
              storyLine: [
                ...storyLine,
                "As you drop the ring, you sense a great magical power blast through you. You see youself fade back into view.",
              ],
              itemLocation: { ...itemLocation, ring: currentRoom },
            },
            aborted: true,
          };
        }
        break;
      case "get":
        if (itemLocation[target] === currentRoom) {
          return {
            ...payload,
            gameState: {
              ...gameState,
              isInvisible: true,
              storyLine: [
                ...storyLine,
                "As you pick up the ring, you sense a great magical power blast through you.  The ring has made you, and everything you are carrying invisible.",
              ],
              itemLocation: { ...itemLocation, ring: "player" },
            },
            aborted: true,
          };
        }
        break;
      default:
        return payload;
    }
  }
  return payload;
};
