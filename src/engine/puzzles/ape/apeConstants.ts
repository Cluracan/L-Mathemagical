//Types
export type ApeState = {
  puzzleCompleted: boolean;
  feedback: string[];
  status: "instructions" | "play";
  word: string;
};

//Static data
export const apeFeedback = {
  instructions: [
    '"I would like to help you, but I am a rather stupid ape....',
    "...if I was a wise animal like an owl, I might be able to help you...",
    '...perhaps you could turn me into an owl?", the ape asks hopefully.',
    " ",
    '"I once turned a pig into a sty. Would you like to know how I did it?"',
  ],
  demo: [
    "The ape clears some space on the ground and writes out,",
    "\tpig",
    "\tbig",
    "\tbag",
    "\tsag",
    "\tsay",
    "\tsty",
    '"...it was very difficult. But you are much cleverer than I am and perhaps you could change me into an owl?"',
    " ",
  ],
  userInput: {
    wrongLength: '"Hmm?" says the ape.',
    doesNotConnect: '"You can\'t do that!" cries the ape. "Start again!"',
    isNotWord: 'The ape looks confused. "That\'s not a word!"',
    success:
      "The ape immediately starts to shrink and sprout feathers. In less than a minute she has turned into a magnificent barn owl. She flaps her wings, a little uncertainly at first, and then swoops down. With her talons she snatches the rope ladder, flies off with it towards the palace, and soon disappears out of sight behind some trees.",
    validWord: '"OK," says the ape.',
  },
  storyLineFailure: "The ape climbs a nearby tree and sits on a branch",
  storyLineSuccess:
    "The owl has disappeared behind the treeline with your ladder - you can only hope that she has dropped it somewhere obvious!",
};

//Initial State
export const initialApeState: ApeState = {
  puzzleCompleted: false,
  feedback: apeFeedback.instructions,
  status: "instructions",
  word: "ape",
};
