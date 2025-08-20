import type { GameState } from "../gameEngine";

type NullCommandArgs = {
  command: null;
  target: string | null;
  gameState: GameState;
};

type HandleNullCommand = (args: NullCommandArgs) => GameState;

export const handleNull: HandleNullCommand = (args) => {
  return args.gameState;
};
