import { handleDrop } from "./actions/handleDrop";
import { handleGet } from "./actions/handleGet";
import { handleInventory } from "./actions/handleInventory";
import { handleLook } from "./actions/handleLook";
import { handleMove } from "./actions/handleMove";
import { handleNull } from "./actions/handleNull";
import { handleTeleport } from "./actions/handleTeleport";
import { handleUse } from "./actions/handleUse";
import type { GameState } from "./gameEngine";
import { handleBudge } from "./actions/handleBudge";
import { handleDrink } from "./actions/handleDrink";
import { handleSay } from "./actions/handleSay";
import { handleSwim } from "./actions/handleSwim";

export interface CommandArgs {
  command: Command;
  target: string | null;
  gameState: GameState;
}
export type HandleCommand = (args: CommandArgs) => GameState;

const commandHandlers = {
  budge: handleBudge,
  drink: handleDrink,
  drop: handleDrop,
  get: handleGet,
  inventory: handleInventory,
  look: handleLook,
  move: handleMove,
  say: handleSay,
  swim: handleSwim,
  teleport: handleTeleport,
  use: handleUse,
} as const satisfies Record<string, HandleCommand>;
export type Command = keyof typeof commandHandlers;

interface DispatchArgs {
  command: Command | null;
  target: string | null;
  gameState: GameState;
}
type DispatchCommand = (args: DispatchArgs) => GameState;

export const dispatchCommand: DispatchCommand = (args) => {
  const { command, target, gameState } = args;
  return command
    ? commandHandlers[command]({ command, target, gameState })
    : handleNull({ target, gameState, command });
};
