import type { PuzzleNPC } from "../types";

export const batNPC: PuzzleNPC = {
  usesDialog: false,
  description: {
    long: "One especially large bat is eyeing you suspiciously.",
    short: "One especially large bat is eyeing you suspiciously.",
    completed: "The large bat ignores you.",
  },
  triggerPuzzleCommand: "move",
  requiredItems: [],
  acceptPuzzleText: ["nw", "ne", "s"],
  rejectPuzzleText: [],
  feedback: {
    puzzleAccept:
      '"If you want to get out of this room, give me a nice number between 30 and 90," says the large bat threateningly.',
    puzzleReject: null,
    puzzleIsComplete: null,
    exitsBlocked:
      "As you move towards the door, hundreds of bats swarm around it making it impossible for you to go through.",
  },
  examinableItems: {
    bat: {
      puzzleIncomplete:
        "The bat is hanging from a point near the centre of the room, watching you closely.",
      puzzleComplete:
        "The bat is hanging from a point near the centre of the room, but it appears to have lost all interest in you.",
    },
  },
};
