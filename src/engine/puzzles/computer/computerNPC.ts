import type { PuzzleNPC } from "../types";

export const computerNPC: PuzzleNPC = {
  usesDialog: true,
  description: {
    long: "In the middle of the room, there is a computer resting on a large wooden bench.",
    short:
      "In the middle of the room, there is a computer resting on a large wooden bench.",
    completed: `"In the middle of the room, there is a computer resting on a large wooden bench."`,
  },
  triggerPuzzleCommand: "use",
  requiredItems: [],
  acceptPuzzleText: ["computer", "bbc", "micro"],
  rejectPuzzleText: [],
  feedback: {
    puzzleAccept: "You sit at the computer, and type '!BOOT'",
    puzzleReject: null,
    puzzleIsComplete: "The computer doesn't seem to be working currently.",
    exitsBlocked: null,
  },
  examinableItems: {
    computer: {
      puzzleIncomplete:
        "The cream case and row of orange function keys identify this as a BBC Micro - probably the Model B. It looks in fully working order...",
      puzzleComplete:
        "This classic BBC Micro has clearly seen many hours of use. It doesn't currently seem to be working.",
    },
    keys: {
      puzzleIncomplete:
        "Aside from the bright orange ones at the top of the keyboard, the other keys are black in colour with white text. The whole machine looks in remarkably good condition!",
      puzzleComplete:
        "Aside from the bright orange ones at the top of the keyboard, the other keys are black in colour with white text. The whole machine looks in remarkably good condition! That said, it doesn't currently seem to be working.",
    },
  },
};
