import type { PuzzleNPC } from "../types";

export const pigNPC: PuzzleNPC = {
  usesDialog: true,
  description: {
    long: "In the middle of the room, a large pig is staring at you. It has a piece of paper attached to its collar.",
    short:
      "A large pig is staring at you. It has a piece of paper attached to its collar.",
    inProgress: null,
    completed: "The large pig eyes you warily.",
  },
  triggerPuzzleCommand: "get",
  requiredItems: [],
  acceptPuzzleText: ["pig", "paper"],
  rejectPuzzleText: [],
  feedback: {
    puzzleAccept: "You decide to catch the pig.",
    puzzleReject: null,
    puzzleIsComplete: "The pig is too intelligent to be caught a second time!",
    exitsBlocked: null,
  },
  examinableItems: {
    pig: {
      puzzleIncomplete:
        "The pig looks back at you, but makes no effort to move. It has a piece of paper attached to its collar...",
      puzzleComplete:
        "The pig watches you carefully. It still has a piece of paper attached to its collar.",
    },
    paper: {
      puzzleIncomplete:
        "There is definitely something written on the paper, but you can't make out what from this distance.",
      puzzleComplete: "The paper has a single word written on it: NEUMANN",
    },
  },
};
