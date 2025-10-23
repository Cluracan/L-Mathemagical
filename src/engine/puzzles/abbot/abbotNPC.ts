import type { PuzzleNPC } from "../types";

export const abbotNPC: PuzzleNPC = {
  usesDialog: false,
  description: {
    long: 'The abbot is standing in one corner. He asks, "Can you help me, please?".',
    short: '"Ah!", says the abbot.  "Have you come back to help me?"',
    inProgress: "The abbot looks at you expectantly.",
    completed: null,
  },
  triggerPuzzleCommand: "say",
  requiredItems: [],
  acceptPuzzleText: ["yes", "y"],
  rejectPuzzleText: ["no", "n"],
  feedback: {
    puzzleAccept: `The abbot beckons you closer, eyes flicking towards the doorway.\n\n"There is something hidden within the palace - an ancient relic of great power, called the Amulet of Yendor. The Drogos stole it long ago, fearing the strange ability it grants its bearer: the power to see patterns others cannot."\n\nHe pauses for a moment, letting this sink in, "Shall I go on?"`,
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
    long: "The abbot is just disappearing through the door at the north end.",
    short: "",
    inProgress: null,
    completed: null,
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
    long: "The east door has just swung closed.",
    short: "",
    inProgress: null,
    completed: null,
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
