import type { PuzzleNPC } from "../types";

export const abbotNPC: PuzzleNPC = {
  usesDialog: false,
  description: {
    long: 'The abbot is standing in one corner. He asks, "Can you help me, please?".',
    short: '"Ah!", says the abbot.  "Have you come back to help me?"',
    completed: null,
  },
  triggerPuzzleCommand: "say",
  requiredItems: [],
  acceptPuzzleText: ["yes", "y"],
  rejectPuzzleText: ["no", "n"],
  feedback: {
    puzzleAccept: `The abbot tells you he is looking for a girl called Runia, who has been captured by the Grey Drogos who inhabit the palace.  The Drogos have taken Runia because they fear she is dangerous to them. Partly they fear her long red hair, but mostly they are afraid because she has discovered the Drogo's one weakness and, if she is allowed to reveal this, someone may challenge the Drogos' power.\n\n"Shall I go on?" asks the abbot.`,
    puzzleReject: "The abbot sniffs sadly.",
    puzzleIsComplete: null,
    exitsBlocked: null,
  },
  examinableItems: {
    abbot: {
      puzzleIncomplete:
        'The abbot is wearing a long, flowing robe. He looks at you hopefully - "Will you help me please?"',
      puzzleComplete: null,
    },
  },
};

export const abbotHallwayNPC: PuzzleNPC = {
  usesDialog: false,
  description: {
    completed: null,
    long: "The abbot is just disappearing through the door at the north end.",
    short: "",
  },
  triggerPuzzleCommand: "say",
  requiredItems: [],
  acceptPuzzleText: [],
  rejectPuzzleText: [],
  feedback: {
    puzzleAccept: "",
    puzzleReject: "",
    puzzleIsComplete: null,
    exitsBlocked: null,
  },
  examinableItems: {},
};

export const abbotKitchenNPC: PuzzleNPC = {
  usesDialog: false,
  description: {
    completed: null,
    long: "The east door has just swung closed.",
    short: "",
  },
  triggerPuzzleCommand: "say",
  requiredItems: [],
  acceptPuzzleText: [],
  rejectPuzzleText: [],
  feedback: {
    puzzleAccept: "",
    puzzleReject: "",
    puzzleIsComplete: null,
    exitsBlocked: null,
  },
  examinableItems: {},
};
