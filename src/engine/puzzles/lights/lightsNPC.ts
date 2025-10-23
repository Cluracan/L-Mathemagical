import type { PuzzleNPC } from "../types";

export const lightsNPC: PuzzleNPC = {
  usesDialog: true,
  description: {
    long: `An electrician is standing in the room with you.\n\n"Oh, please can you help me? I have to set these spotlights for this evening's reception. The Drogo Committee will appear in their different coloured costumes and I have to shine the right colours onto them or else they look awful. But one of the four switches doesn't work. Will you help?"`,
    short: `"Oh, it's you again", says the electrician.  "Will you help me with these lights?"`,
    inProgress: null,
    completed:
      "The electrician is busy fiddling with some wires, and doesn't seem to notice you.",
  },
  triggerPuzzleCommand: "say",
  requiredItems: [],
  acceptPuzzleText: ["yes", "y"],
  rejectPuzzleText: ["no", "n"],
  feedback: {
    puzzleAccept: "You agree to help the electrician.",
    puzzleReject: "The electrician turns sadly back to her switches.",
    puzzleIsComplete: null,
    exitsBlocked: null,
  },
  examinableItems: {
    electrician: {
      puzzleIncomplete:
        'The electrician appears to be very busy fitting a sound system for tonight\'s entertainment. She turns to you hopefully - "Will you help me with the lighting please?"',
      puzzleComplete:
        'The electrician is staring intently at the sound system. She glances up and smiles gratefully - "Many thanks for the help earlier."',
    },
  },
};
