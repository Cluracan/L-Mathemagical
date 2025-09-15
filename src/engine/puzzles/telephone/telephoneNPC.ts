import type { PuzzleNPC } from "../types";

export const telephoneNPC: PuzzleNPC = {
  usesDialog: false,
  description: {
    long: "There is an old fashioned telephone resting on the chest.",
    short: "A telephone rests on the oak chest.",
    completed: null,
  },
  triggerPuzzleCommand: "use",
  acceptPuzzleText: ["telephone", "phone"],
  rejectPuzzleText: [],
  feedback: {
    puzzleAccept: "You pick up the receiver and ponder what number to dial...",
    puzzleReject: null,
    puzzleIsComplete:
      "The handset cord is so tangled that you can't even lift it to your ear! Someone must have been fiddling with it.",
    exitsBlocked: null,
  },
  examinableItems: {
    telephone: {
      puzzleIncomplete:
        "You recognise this as the 9003R Statesman model from 1984. It is cream in colour, and appears to be in good working order.",
      puzzleComplete:
        "This phone has been used recently, but clearly someone has been playing with the coiled cord, as it is knotted beyond repair...",
    },
    phone: {
      puzzleIncomplete:
        "You recognise this as the 9003R Statesman model from 1984. It is cream in colour, and appears to be in good working order.",
      puzzleComplete:
        "This phone has been used recently, but clearly someone has been playing with the coiled cord, as it is knotted beyond repair...",
    },
    cord: {
      puzzleIncomplete:
        "This tightly coiled cord connects the body of the phone to the handset.",
      puzzleComplete:
        "You must have been playing wiuth the cord whilst you were using the phone!  It is now tangled beyond repair...",
    },
  },
  rewardItems: null,
};
