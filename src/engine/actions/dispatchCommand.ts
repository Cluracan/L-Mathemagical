import { handleMove } from "./handleMove";
import { handleNull } from "./handleMove";
import type { GameState } from "../gameEngine";
import type { Command } from "../parser/parseInput";

export type HandleCommand = ({
  keyWord,
  state,
}: {
  keyWord: string;
  state: GameState;
}) => GameState;

const commandHandlers: Record<Command, HandleCommand> = {
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
};

export const dispatchCommand = ({
  command,
  keyWord,
  state,
}: {
  command: Command | null;
  keyWord: string;
  state: GameState;
}) => {
  if (command && isCommandHandlerKey(command)) {
    const handler = commandHandlers[command];
    return handler({ keyWord, state });
  } else {
    return handleNull({ keyWord, state });
  }
};

const isCommandHandlerKey = (
  key: string
): key is keyof typeof commandHandlers => {
  return key in commandHandlers;
};
