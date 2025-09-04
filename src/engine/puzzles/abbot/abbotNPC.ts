import type { PuzzleNPC } from "../types";

export const abbotNPC: PuzzleNPC = {
  puzzleId: "abbot",
  usesDialog: false,
  description: {
    completed: null,
    long: 'The abbot is standing in one corner. He asks, "Can you help me, please?".',
    short: '"Ah!", says the abbot.  "Have you come back to help me?"',
  },
  triggerPuzzleCommand: "say",
  acceptPuzzleText: ["yes", "y", "ok", "o.k.", "o.k"],
  rejectPuzzleText: ["no", "n"],
  feedback: {
    failPuzzleAccept: null,
    puzzleAccept: `The abbot tells you he is looking for a girl called Runia, who has been captured by the Grey Drogos who inhabit the palace.  The Drogos have taken Runia because they fear she is dangerous to them. Partly they fear her long red hair, but mostly they are afraid because she has discovered the Drogo's one weakness and, if she is allowed to reveal this, someone may challenge the Drogos' power.\n\n"Shall I go on?" asks the abbot.`,
    puzzleReject: "The abbot sniffs sadly.",
    blockedExits: null,
  },
  examinableItems: {
    abbot:
      'The abbot is wearing a long, flowing robe. He looks at you hopefully - "Will you help me please?"',
  },
  rewardItems: null,
};

export const abbotHallwayNPC: PuzzleNPC = {
  puzzleId: "abbot",
  usesDialog: false,
  description: {
    completed: null,
    long: "The abbot is just disappearing through the door at the north end.",
    short: "",
  },
  triggerPuzzleCommand: "say",
  acceptPuzzleText: [],
  rejectPuzzleText: [],
  feedback: {
    failPuzzleAccept: null,
    puzzleAccept: "",
    puzzleReject: "",
    blockedExits: null,
  },
  examinableItems: {},
  rewardItems: null,
};

export const abbotKitchenNPC: PuzzleNPC = {
  puzzleId: "abbot",
  usesDialog: false,
  description: {
    completed: null,
    long: "The east door has just swung closed.",
    short: "",
  },
  triggerPuzzleCommand: "say",
  acceptPuzzleText: [],
  rejectPuzzleText: [],
  feedback: {
    failPuzzleAccept: null,
    puzzleAccept: "",
    puzzleReject: "",
    blockedExits: null,
  },
  examinableItems: {},
  rewardItems: null,
};
