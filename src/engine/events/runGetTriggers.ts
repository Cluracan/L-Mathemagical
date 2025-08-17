import type { GetPipelineFunction } from "../actions/handleGet";

export const runGetTriggers: GetPipelineFunction = (payload) => {
  //ring check (precioussss)
  const { target, gameState } = payload;
  const { storyLine, itemLocation, currentRoom } = gameState;

  if (target === "ring" && itemLocation[target] === currentRoom) {
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
    };
  }

  return payload;
};
