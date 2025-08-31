import type { PuzzleNPC } from "../types";

export const abbotNPC: PuzzleNPC = {
  puzzleId: "abbot",
  usesDialog: false,
  description: {
    completed: "",
    long: 'The abbot is standing in one corner. He asks, "Can you help me, please?".',
    short: '"Ah!", says the abbot.  "Have you come back to help me?"',
  },
  triggerPuzzleCommand: "say",
  acceptPuzzleText: ["yes", "y", "ok", "o.k.", "o.k"],
  rejectPuzzleText: ["no", "n"],
  feedback: {
    failPuzzleAccept: null,
    puzzleAccept: "You agree to help the abbot.",
    puzzleReject: "The abbot sniffs sadly.",
    puzzleComplete:
      "A strange sound behind you attracts your attention. When you turn back the abbot has vanished.",
    blockedExits: "You are temporarily stranded",
  },
  examinableItems: {
    abbot:
      'The abbot is wearing a long, flowing robe. He looks at you hopefully - "Will you help me please?"',
  },
  rewardItems: null,
};
