import type { PuzzleNPC } from "../types";

export const snookerNPC: PuzzleNPC = {
  usesDialog: true,
  description: {
    long: "An oval-shaped snooker table stands in the centre of the room. A cue is attached to the table by a long chain.",
    short:
      "An oval-shaped snooker table stands in the centre of the room. A cue is attached to the table by a long chain.",
    inProgress: null,
    completed: null,
  },
  triggerPuzzleCommand: "get",
  requiredItems: [],
  acceptPuzzleText: ["cue"],
  rejectPuzzleText: [],
  feedback: {
    puzzleAccept: "You pick up the cue, and take aim...",
    puzzleReject: null,
    puzzleIsComplete: null,
    exitsBlocked: null,
  },
  examinableItems: {
    table: {
      puzzleIncomplete:
        "This snooker table is most unusual! It is elliptical in shape, and has a single pocket, located at one end of the table. There is a yellow ball, resting on the spot at the other end. You don't think anyone would mind if you used the cue to take a few shots...",
      puzzleComplete: null,
    },
    cue: {
      puzzleIncomplete:
        "The snooker cue is attached to the table by a long chain. You could still use it to play, though!",
      puzzleComplete: null,
    },
    ball: {
      puzzleIncomplete:
        "The snooker ball is resting on its spot at one side of the table. There is a snooker cue nearby...",
      puzzleComplete: null,
    },
  },
};
