import type { PipelineFunction } from "../actions/dispatchCommand";

export const runDropTriggers: PipelineFunction = (payload) => {
  //ring check (precioussss)
  const { target, gameState } = payload;
  const { storyLine, itemLocation, currentRoom } = gameState;

  if (target === "ring" && itemLocation[target] === "player") {
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
    };
  }

  return payload;
};
