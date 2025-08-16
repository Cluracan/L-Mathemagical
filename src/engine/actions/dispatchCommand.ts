import { handleMove } from "./handleMove";
import { handleNull } from "./handleMove";
import type { GameState } from "../gameEngine";

const commandHandlers = {
  BUDGE: handleNull,
  DRINK: handleNull,
  DROP: handleNull,
  GET: handleNull,
  INVENTORY: handleNull,
  LOOK: handleNull,
  MOVE: handleMove,
  SAY: handleNull,
  SWIM: handleNull,
  TELEPORT: handleNull,
  USE: handleNull,
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
