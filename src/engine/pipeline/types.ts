import type { ExitDirection, RoomId } from "../../assets/data/roomData";
import type { Command } from "../dispatchCommand";
import type { GameState } from "../gameEngine";

export type PipelinePayload = {
  command: Command;
  target: string | null;
  gameState: GameState;
  direction?: ExitDirection | null;
  nextRoom?: RoomId | null;
  done: boolean;
};

export type PipelineFunction = (args: PipelinePayload) => PipelinePayload;
