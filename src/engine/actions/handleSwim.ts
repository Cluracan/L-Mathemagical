import type { HandleCommand } from "../dispatchCommand";

const swimFeedback = {
  pool: "Diving into an empty swimming pool would be a bad idea.  You could always go down the steps, perhaps?",
  poolFloor:
    "Waving your arms and legs about in an empty pool will look very silly.",
  riverS:
    "As you enter the water, a pirhana fish gives you a nasty nip on your big toe. You hastily retreat to the bank.",
  riverN:
    "As you enter the water, a pirhana fish gives you a nasty nip on your little toe. You hastily retreat to the bank.",
  default: "This doesn't appear to be a good place to swim...",
};

export const handleSwim: HandleCommand = (args) => {
  const { gameState } = args;
  const { currentRoom, storyLine } = gameState;

  switch (currentRoom) {
    case "pool":
      return {
        ...gameState,
        storyLine: [...storyLine, swimFeedback.pool],
      };
    case "poolFloor":
      return {
        ...gameState,
        storyLine: [...storyLine, swimFeedback.poolFloor],
      };
    case "riverS":
      return {
        ...gameState,
        storyLine: [...storyLine, swimFeedback.riverS],
      };

    case "riverN":
      return {
        ...gameState,
        storyLine: [...storyLine, swimFeedback.riverN],
      };
    default:
      return {
        ...gameState,
        storyLine: [...storyLine, swimFeedback.default],
      };
  }
};
