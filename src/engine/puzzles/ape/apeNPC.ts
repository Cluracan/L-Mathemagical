import type { PuzzleNPC } from "../types";

export const apeNPC: PuzzleNPC = {
  usesDialog: false,
  description: {
    long: "A large ape is sitting in a nearby tree.",
    short: "An ape is sitting in a nearby tree.",
    completed: null,
  },
  triggerPuzzleCommand: "use",
  requiredItems: ["ladder", "oar"],
  acceptPuzzleText: ["bath"],
  rejectPuzzleText: [],
  feedback: {
    puzzleAccept:
      'The bath won\'t carry that much weight. You must take fewer things with you or you will sink.\n\nThe large ape climbs down from the tree, lumbers up to you and asks, "Are you trying to get the ladder across the river?"',
    puzzleReject: null,
    puzzleIsComplete: null,
    exitsBlocked: null,
  },
  examinableItems: {
    ape: {
      puzzleIncomplete:
        "The ape is large, and hairy. It doesn't seem particularly interested in you.",
      puzzleComplete: null,
    },
    tree: {
      puzzleIncomplete:
        "This tree is apple tree. It doesn't have any apples in it - just a large ape.",
      puzzleComplete:
        "This apple tree seems to have lost all its apples. It has also lost an ape.",
    },
  },
};
