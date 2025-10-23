import type { PuzzleNPC } from "../types";

export const treeNPC: PuzzleNPC = {
  usesDialog: true,
  description: {
    long: 'A man, who looks very much like a gardener, is scratching his head and mumbling to himself about a pile of young fruit trees lying on the ground.\n\n"I have something here which you are going to need," he says. "But first you must help me. The Drogos have given me firm instructions to plant these 9 trees in the clearing so that there are 10 straight rows with three trees in each row. I can\'t seem to do it. Can you help me?"',
    short:
      'The gardener looks up as you approach. "Have you come back to help me with these trees?"',
    inProgress: null,
    completed: "Through the trees, you can see the gardener pruning a tree.",
  },
  triggerPuzzleCommand: "say",
  requiredItems: [],
  acceptPuzzleText: ["yes", "y"],
  rejectPuzzleText: ["no", "n"],
  feedback: {
    puzzleAccept: "You agree to help the gardner with his trees.",
    puzzleReject: "The gardener sighs, and turns back to the fruit trees.",
    puzzleIsComplete: null,
    exitsBlocked: null,
  },
  examinableItems: {
    gardener: {
      puzzleIncomplete:
        'The gardener has a puzzled look on his face. "I just can\'t work it out!" he says. "Could you help?"',
      puzzleComplete:
        'The gardener beams at you gratefully. "That was very clever of you!"',
    },
  },
};
