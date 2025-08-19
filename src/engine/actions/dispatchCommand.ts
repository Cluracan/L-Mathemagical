import { handleDrop } from "./handleDrop";
import { handleGet } from "./handleGet";
import { handleInventory } from "./handleInventory";
import { handleLook } from "./handleLook";
import { handleMove } from "./handleMove";
import { handleNull } from "./handleNull";
import { handleTeleport } from "./handleTeleport";
import { handleUse } from "./handleUse";
import type { GameState } from "../gameEngine";

const commandHandlers = {
  budge: handleNull,
  drink: handleNull,
  drop: handleDrop,
  get: handleGet,
  inventory: handleInventory,
  look: handleLook,
  move: handleMove,
  say: handleNull,
  swim: handleNull,
  teleport: handleTeleport,
  use: handleUse,
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
