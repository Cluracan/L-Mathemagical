import { handleMove } from "./handleMove";
import { handleNull } from "./handleMove";
import type { GameState } from "../gameEngine";
import { handleLook } from "./handleLook";

const commandHandlers = {
  budge: handleNull,
  drink: handleNull,
  drop: handleNull,
  get: handleNull,
  inventory: handleNull,
  look: handleLook,
  move: handleMove,
  say: handleNull,
  swim: handleNull,
  teleport: handleNull,
  use: handleNull,
} as const satisfies Record<string, HandleCommand>;

export type Command = keyof typeof commandHandlers;

export type HandleCommand = (args: {
  keyWord: string | null;
  gameState: GameState;
}) => GameState;

type DispatchCommand = (args: {
  command: Command | null;
  keyWord: string | null;
  gameState: GameState;
}) => GameState;

export const dispatchCommand: DispatchCommand = ({
  command,
  keyWord,
  gameState,
}) => {
  if (command) {
    const handler = commandHandlers[command];
    return handler({ keyWord, gameState });
  } else {
    return handleNull({ keyWord, gameState });
  }
};
