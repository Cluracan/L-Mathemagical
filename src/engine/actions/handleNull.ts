import type { HandleCommand } from "./dispatchCommand";

export const handleNull: HandleCommand = ({ target, gameState }) => {
  console.log(target);
  return gameState;
};
