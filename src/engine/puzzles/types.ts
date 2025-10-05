import type { ItemId } from "../../assets/data/itemData";
import type { Command } from "../dispatchCommand";

export interface PuzzleNPC {
  usesDialog: boolean;
  description: {
    long: string;
    short: string;
    completed: string | null;
  };
  triggerPuzzleCommand: Command;
  requiredItems: ItemId[];
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
}
