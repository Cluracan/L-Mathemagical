import { handleDrop } from "./handleDrop";
import { handleGet } from "./handleGet";
import { handleInventory } from "./handleInventory";
import { handleLook } from "./handleLook";
import { handleMove } from "./handleMove";
import { handleNull } from "./handleNull";
import { handleTeleport } from "./handleTeleport";
import { handleUse } from "./handleUse";
import type { GameState } from "../gameEngine";
import type { ExitDirection, RoomId } from "../../assets/data/roomData";
import { handleBudge } from "./handleBudge";
import { handleDrink } from "./handleDrink";
import { handleSay } from "./handleSay";
import { handleSwim } from "./handleSwim";

export type CommandArgs = {
  command: Command;
  target: string | null;
  gameState: GameState;
};
export type HandleCommand = (args: CommandArgs) => GameState;

export type PipelinePayload = {
  command: Command;
  target: string | null;
  gameState: GameState;
  direction?: ExitDirection | null;
  nextRoom?: RoomId | null;
  done: boolean;
};

export type PipelineFunction = (args: PipelinePayload) => PipelinePayload;

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

type DispatchArgs = {
  command: Command | null;
  target: string | null;
  gameState: GameState;
};
type DispatchCommand = (args: DispatchArgs) => GameState;

export const dispatchCommand: DispatchCommand = (args) => {
  const { command, target, gameState } = args;
  return command
    ? commandHandlers[command]({ command, target, gameState })
    : handleNull({ target, gameState, command });
};
