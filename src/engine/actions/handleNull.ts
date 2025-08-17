import type { HandleCommand } from "./dispatchCommand";

export const handleNull: HandleCommand = ({ keyWord, gameState }) => {
  console.log(keyWord);
  return gameState;
};
