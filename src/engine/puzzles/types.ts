import type { ItemId } from "../../assets/data/itemData";
import type { RoomId } from "../../assets/data/roomData";
import type { Command } from "../dispatchCommand";

export type PuzzleNPC = {
  usesDialog: boolean;
  description: {
    long: string;
    short: string;
    completed: string | null;
  };
  triggerPuzzleCommand: Command;
  acceptPuzzleText: string[];
  rejectPuzzleText: string[];
  feedback: {
    puzzleAccept: string;
    puzzleReject: string | null;
    puzzleIsComplete: string | null;
    exitsBlocked: string | null;
  };
  examinableItems: Record<
    string,
    { puzzleIncomplete: string; puzzleComplete: string | null }
  >;
  rewardItems: Partial<Record<ItemId, "player" | "floor" | RoomId>> | null;
};
