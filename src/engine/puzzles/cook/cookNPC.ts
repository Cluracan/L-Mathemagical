import type { PuzzleNPC } from "../types";

export const cookNPC: PuzzleNPC = {
  usesDialog: true,
  description: {
    long: "The cook is sobbing bitterly but, on seeing you, manages to speak.\"I'm glad to see you. I'm desperately worried. The drogos are having a croquet party, and I have to bake a special cake for their tea on the lawn. The trouble is they insist that it must be at least 25 cm high and I can't get it to rise properly. Will you help me, please?",
    short: `The cook looks up hopefully as you enter. "Will you help me with this cake, please?"`,
    completed: `The cook is fast asleep.`,
  },
  triggerPuzzleCommand: "say",
  acceptPuzzleText: ["yes", "y"],
  rejectPuzzleText: ["no", "n"],
  feedback: {
    puzzleAccept: "You help the cook with their cake.",
    puzzleReject: "The cook's sobs become more intense.",
    puzzleIsComplete: null,
    exitsBlocked: null,
  },
  examinableItems: {
    cook: {
      puzzleIncomplete:
        'The cook looks around at the mixing bowls. "I just can\'t seem to get this right! Could you help me please?"',
      puzzleComplete: "The cook is sound asleep.",
    },
    bowl: {
      puzzleIncomplete:
        "The bowl is half full of cake mixture. It doesn't look quite right - maybe you should offer to help?",
      puzzleComplete:
        "The bowl still has the remenants of an excellent cake mixture at the bottom.",
    },
  },
};
