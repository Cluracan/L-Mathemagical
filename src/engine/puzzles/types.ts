import type { ItemId } from "../../assets/data/itemData";
import type { RoomId } from "../../assets/data/roomData";
import type { Command } from "../dispatchCommand";
import type { PuzzleId } from "./puzzleRegistry";

export type PuzzleNPC = {
  puzzleId: PuzzleId;
  usesDialog: boolean;
  description: {
    completed: string | null;
    long: string;
    short: string;
  };
  triggerPuzzleCommand: Command;
  acceptPuzzleText: string[];
  rejectPuzzleText: string[];
  feedback: {
    failPuzzleAccept: string | null;
    puzzleAccept: string;
    puzzleReject: string | null;
    blockedExits: string | null;
  };
  examinableItems: Record<string, string>;
  rewardItems: Partial<Record<ItemId, "player" | "floor" | RoomId>> | null;
};
