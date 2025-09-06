import type { PuzzleNPC } from "../types";

export const keyNPC: PuzzleNPC = {
  puzzleId: "key",
  usesDialog: true,
  description: {
    completed: null,
    long: "On the mantlepiece there are several key blanks and a small file.",
    short: "On the mantlepiece there are several key blanks and a small file.",
  },
  triggerPuzzleCommand: "use",
  acceptPuzzleText: ["file", "blank", "blanks"],
  rejectPuzzleText: [],
  feedback: {
    failPuzzleAccept: null,
    puzzleAccept: "You pick up the file, and try to make a key.",
    puzzleReject: null,
    blockedExits: null,
  },
  examinableItems: {
    file: "This small file looks like it has been used recently. There are some metal filings scattered nearby.",
    blank:
      "This key blank is a small rectangular piece of metal - it could be used to create a key...",
    blanks:
      "These key blanks are small rectangular pieces of metal - they could be used to create keys...",
    filings:
      "These tiny bits of metal suggest that someone has used the nearby file recently...",
  },
  rewardItems: {
    iron: "floor",
  },
};
