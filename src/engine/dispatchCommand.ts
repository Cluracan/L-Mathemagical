import type { GameState } from "./gameEngine";
import { handleDrop } from "./actions/handleDrop";
import { handleGet } from "./actions/handleGet";
import { handleInventory } from "./actions/handleInventory";
import { handleLook } from "./actions/handleLook";
import { handleMove } from "./actions/handleMove";
import { handleUnknown } from "./actions/handleUnknown";
import { handleTeleport } from "./actions/handleTeleport";
import { handleUse } from "./actions/handleUse";
import { handleBudge } from "./actions/handleBudge";
import { handleDrink } from "./actions/handleDrink";
import { handleSay } from "./actions/handleSay";
import { handleSwim } from "./actions/handleSwim";

interface CommandArgs {
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
  unknown: handleUnknown,
} as const;
export type Command = keyof typeof commandHandlers;

export const dispatchCommand: HandleCommand = (args) => {
  const { command, target, gameState } = args;
  const commandHandler = commandHandlers[command];

  return commandHandler({ command, target, gameState });
};
