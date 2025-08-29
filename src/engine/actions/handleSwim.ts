import type { HandleCommand } from "../dispatchCommand";

export const handleSwim: HandleCommand = (args) => {
  const { gameState } = args;
  const { currentRoom, storyLine } = gameState;

  switch (currentRoom) {
    case "pool":
      return {
        ...gameState,
        storyLine: [
          ...storyLine,
          "Diving into an empty swimming pool would be a bad idea.  You could always go down the steps, perhaps?",
        ],
      };
    case "poolFloor":
      return {
        ...gameState,
        storyLine: [
          ...storyLine,
          "Waving your arms and legs about in an empty pool will look very silly.",
        ],
      };
    case "riverS":
      return {
        ...gameState,
        storyLine: [
          ...storyLine,
          "As you enter the water, a pirhana fish gives you a nasty nip on your big toe. You hastily retreat to the bank.",
        ],
      };

    case "riverN":
      return {
        ...gameState,
        storyLine: [
          ...storyLine,
          "As you enter the water, a pirhana fish gives you a nasty nip on your little toe. You hastily retreat to the bank.",
        ],
      };
    default:
      return {
        ...gameState,
        storyLine: [
          ...storyLine,
          "This doesn't appear to be a good place to swim...",
        ],
      };
  }
};
