import type { PuzzleNPC } from "../types";

export const keyNPC: PuzzleNPC = {
  usesDialog: true,
  description: {
    long: "On the mantlepiece there are several key blanks and a small file.",
    short: "On the mantlepiece there are several key blanks and a small file.",
    inProgress: null,
    completed: null,
  },
  triggerPuzzleCommand: "get",
  requiredItems: [],
  acceptPuzzleText: ["file", "blank", "blanks"],
  rejectPuzzleText: [],
  feedback: {
    puzzleAccept: "You pick up the file, and try to make a key.",
    puzzleReject: null,
    puzzleIsComplete: null,
    exitsBlocked: null,
  },
  examinableItems: {
    file: {
      puzzleIncomplete:
        "This small file looks like it has been used recently...",
      puzzleComplete:
        "This small file has been used recently. There are some metal filings scattered nearby",
    },
    blank: {
      puzzleIncomplete:
        "This key blank is a small rectangular piece of metal - it could be used to create a key...",
      puzzleComplete:
        "This key blank is a small rectangular piece of metal - it could be used to create a key...",
    },
    blanks: {
      puzzleIncomplete:
        "These key blanks are small rectangular pieces of metal - they could be used to create keys...",
      puzzleComplete:
        "These key blanks are small rectanular pieces of metal. It looks like someone has used one recently...",
    },
    filings: {
      puzzleIncomplete:
        "There are traces of iron filings on the file - perhaps someone has been here before you?",
      puzzleComplete:
        "These tiny bits of metal suggest that someone has used the nearby file recently...",
    },
  },
};
