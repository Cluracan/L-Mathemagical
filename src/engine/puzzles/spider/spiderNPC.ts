import type { PuzzleNPC } from "../types";

export const spiderNPC: PuzzleNPC = {
  usesDialog: true,
  description: {
    long: `A huge black spider is hanging by a thread from the ceiling.\n\nThe spider says, "I have something here that may help you, but the Drogos have made it invisible. Will you help me find it?"`,
    short: `The spider looks up as you approach. "Will you help me please?"`,
    completed: null,
  },
  triggerPuzzleCommand: "say",
  requiredItems: [],
  acceptPuzzleText: ["yes", "y"],
  rejectPuzzleText: ["no", "n"],
  feedback: {
    puzzleAccept: "You agree to help the spider.",
    puzzleReject: '"Very well," says the spider.',
    puzzleIsComplete: null,
    exitsBlocked: null,
  },
  examinableItems: {
    spider: {
      puzzleIncomplete:
        'The spider is very old, and looks anxiously at you. "Please will you help?"',
      puzzleComplete: "The spider has gone for a sleep!",
    },
    web: {
      puzzleIncomplete: "You don't see a web here...",
      puzzleComplete:
        "A thin double line of spider silk traces all edges of the room. It glows faintly.",
    },
    cobwebs: {
      puzzleIncomplete:
        "There are traces of spider silk along all the edges of the room, but they don't form any typical web pattern.",
      puzzleComplete:
        "A thin double line of spider silk traces all edges of the room. It glows faintly.",
    },
  },
};
