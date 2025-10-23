import type { PuzzleNPC } from "../types";

export const safeNPC: PuzzleNPC = {
  usesDialog: true,
  description: {
    long: "There is a numerical keypad fixed next to the safe door.",
    short: "There is a numerical keypad fixed next to the safe door.",
    inProgress: null,
    completed: "There is a numerical keypad fixed next to the safe door.",
  },
  triggerPuzzleCommand: "use",
  requiredItems: [],
  acceptPuzzleText: ["keypad", "safe", "pad"],
  rejectPuzzleText: [],
  feedback: {
    puzzleAccept: "You approach the numerical keypad.",
    puzzleReject: null,
    puzzleIsComplete: "The safe door is already open!",
    exitsBlocked: null,
  },
  examinableItems: {
    keypad: {
      puzzleIncomplete:
        "This appears to be a typical electronic safe lock. There is a series of buttons alongside a display screen. There are also a number of lights next to the display.",
      puzzleComplete:
        "The lights on the keypad indicate that the door is unlocked.",
    },
    lights: {
      puzzleIncomplete:
        "You assume that the lights indicate the status of the door. Currently only the first (red) light is lit.",
      puzzleComplete:
        "The lights on the keypad indicate that the door is unlocked.",
    },
  },
};
