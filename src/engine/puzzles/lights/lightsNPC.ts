import type { PuzzleNPC } from "../types";

export const lightsNPC: PuzzleNPC = {
  puzzleId: "lights",
  description: {
    completed:
      "The electrician is busy fiddling with some wires, and doesn't seem to notice you.",
    long: `An electrician is standing in the room with you.\n\n"Oh, please can you help me? I have to set these spotlights for this evening's reception. The Drogo Committee will appear in their different coloured costumes and I have to shine the right colours onto them or else they look awful. But one of the four switches doesn't work. Will you help?"`,
    short: `"Oh, it's you again", says the electrician.  "Will you help me with these lights?"`,
  },
  triggerPuzzleCommand: "say",
  acceptPuzzleText: ["yes", "y"],
  rejectPuzzleText: ["no", "n"],
  feedback: {
    failPuzzleAccept: null,
    puzzleAccept: "You agree to help the electrician.",
    puzzleReject: "The electrician turns sadly back to her switches.",
    puzzleComplete:
      'The electrician thanks you for your help. She wishes you luck and warns you to be careful.\n\n"These Drogos aren\'t to be trusted."\n\nYour attention is caught by a roughly-carved wooden oar which is propped up in one corner of the room. The electrician notices your interest and says, "You can have that if you want it."',
    blockedExits: null,
  },
  examinableItems: {
    electrician:
      'The electrician appear to be very busy fitting a sound system for tonight\'s entertainment. She turns to you hopefully - "Will you help me with the lighting please?"',
  },
  rewardItems: {
    oar: "floor",
  },
};
