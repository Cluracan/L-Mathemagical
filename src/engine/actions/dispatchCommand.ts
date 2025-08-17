import { handleMove } from "./handleMove";
import { handleNull } from "./handleNull";
import { handleLook } from "./handleLook";
import type { GameState } from "../gameEngine";
import { handleTeleport } from "./handleTeleport";

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
  teleport: handleTeleport,
  use: handleNull,
} as const satisfies Record<string, HandleCommand>;

export type Command = keyof typeof commandHandlers;

export type HandleCommand = (args: {
  target: string | null;
  gameState: GameState;
}) => GameState;

type DispatchCommand = (args: {
  command: Command | null;
  target: string | null;
  gameState: GameState;
}) => GameState;

export const dispatchCommand: DispatchCommand = ({
  command,
  target,
  gameState,
}) => {
  console.log({ command, target });
  if (command) {
    const handler = commandHandlers[command];
    return handler({ target, gameState });
  } else {
    return handleNull({ target, gameState });
  }
};
