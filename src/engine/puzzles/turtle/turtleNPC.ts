import type { PuzzleNPC } from "../types";

export const turtleNPC: PuzzleNPC = {
  usesDialog: false,
  description: {
    long: "In the centre of the courtyard lies a turtle basking in a shaft of sunlight. He seems to be trying to catch your attention. Would you like to investigate?",
    short:
      "The turtle is still trying to catch your attention. Will you investigate?",
    completed: "The turtle sleeps soundly in the middle of the courtyard.",
  },
  triggerPuzzleCommand: "say",
  acceptPuzzleText: ["yes", "y"],
  rejectPuzzleText: ["no", "n"],
  feedback: {
    puzzleAccept:
      'As you move towards the turtle, he waves a flipper to attract your attention. "Don\'t approach me directly," he warns. "I\'d like to help you", he says, lowering his voice. "We can meet somewhere provided that it is I who catch up with you. Also," he says, lowering his voice even further, "the Drogos have programmed me to move in a special way. Try moving about a little."',
    puzzleReject: "The turtle looks at you imploringly.",
    puzzleIsComplete: "The turtle is sleeping",
    exitsBlocked: null,
  },
  examinableItems: {
    turtle: {
      puzzleIncomplete:
        "The turtle looks back at you. It seems to have a logo on its shell, but you can't make it out.",
      puzzleComplete: "The turtle is sleeping soundly",
    },
    logo: {
      puzzleIncomplete: "You can't make it out...",
      puzzleComplete: null,
    },
  },
  rewardItems: {
    rusty: "player",
  },
};
