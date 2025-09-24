import type { PuzzleNPC } from "../types";

export const pianoNPC: PuzzleNPC = {
  usesDialog: true,
  description: {
    long: "In the centre of the room is a rather battered Steinway grand piano.",
    short:
      "In the centre of the room is a rather battered Steinway grand piano.",
    completed:
      "In the centre of the room is a rather battered Steinway grand piano.",
  },
  triggerPuzzleCommand: "use",
  acceptPuzzleText: ["piano"],
  rejectPuzzleText: [],
  feedback: {
    puzzleAccept: "You sit carefully on the piano stool and prepare to play.",
    puzzleReject: null,
    puzzleIsComplete:
      "I'm afraid the mouse have gnawed through all the piano strings",
    exitsBlocked: null,
  },
  examinableItems: {
    piano: {
      puzzleIncomplete:
        "This piano has obviously had a lot of use, but then that's the point of a piano.  There is a book of music, titled '100 Nursery Rhymes for Piano' resting on the music stand.",
      puzzleComplete:
        "The mice appear to have left their mark on the piano, but you feel sure that they will be along to mend it later.",
    },
    book: {
      puzzleIncomplete:
        "The book has a good selection of classic nursery rhymes in it. You feel an urge to play one...",
      puzzleComplete:
        "The book has a good selection of classic nursery rhymes, but you resist the urge to play any more.",
    },
    music: {
      puzzleIncomplete:
        "The book of music has a good selection of classic nursery rhymes in it. You feel an urge to play one...",
      puzzleComplete:
        "The book of music has a good selection of classic nursery rhymes, but you resist the urge to play any more.",
    },
    telescope: {
      puzzleIncomplete:
        'The telescope is very old, and the lens is cracked. You notice a small incription on the body. Peering closely, you can just make out the initials, "J.T". It seems to be pointed at something up in the sky.',
      puzzleComplete:
        'The telescope is very old, and the lens is cracked. You notice a small incription on the body. Peering closely, you can just make out the initials, "J.T". It seems to be pointed at something up in the sky.',
    },
  },
};
