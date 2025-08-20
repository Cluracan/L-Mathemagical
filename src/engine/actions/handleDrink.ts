import type { HandleCommand } from "./dispatchCommand";

export const handleDrink: HandleCommand = (args) => {
  return args.gameState;
};
