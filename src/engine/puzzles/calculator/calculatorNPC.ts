import type { PuzzleNPC } from "../types";

export const calculatorNPC: PuzzleNPC = {
  usesDialog: true,
  description: {
    long: "Also in the cupboard is a Drogo Robot Guard with the number 121 emblazoned on his chest. He stands in front of the door, blocking your exit.\n\nThere is a calculator lying on the ground here.",
    short:
      "Also in the cupboard is a Drogo Robot Guard with the number 121 emblazoned on his chest. He stands in front of the door, blocking your exit.\n\nThere is a calculator lying on the ground here.",
    inProgress: null,
    completed: null,
  },
  triggerPuzzleCommand: "get",
  requiredItems: [],
  acceptPuzzleText: ["calculator"],
  rejectPuzzleText: [],
  feedback: {
    puzzleAccept: "You pick up the calculator",
    puzzleReject: null,
    puzzleIsComplete: null,
    exitsBlocked: "The guard is blocking your way",
  },
  examinableItems: {
    calculator: {
      puzzleIncomplete:
        "The tiny calculator looks well-used, but it appears to be working. It is just within reach...",
      puzzleComplete:
        "All you can see are a few scattered buttons, and half the external case. This, is an ex-calculator.",
    },
    guard: {
      puzzleIncomplete:
        "The guard is staring at some point a long way in the distance. It doesn't respond to any sounds you make, and you slowly realise that the guard is deaf.",
      puzzleComplete:
        "The guard has left the room, but you think you can still hear his screams from elsewhere in the palace.",
    },
  },
};
