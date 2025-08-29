import type { HandleCommand } from "../dispatchCommand";

export const handleSay: HandleCommand = (args) => {
  return args.gameState;
};
