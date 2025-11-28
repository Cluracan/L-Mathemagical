// Types
export interface PianoState {
  playedNotes: NoteId[];
  attempts: number;
  feedback: string[];
  puzzleCompleted: boolean;
}
export type NoteId = keyof typeof pianoKeys;
export type NoteName = (typeof pianoKeys)[NoteId]["noteName"];

// Config
export const TARGET_MELODY: NoteName[] = [
  "C",
  "C",
  "G",
  "G",
  "A",
  "A",
  "G",
  "F",
  "F",
  "E",
  "E",
  "D",
  "D",
  "C",
];

// Constants
export const pianoKeys = {
  C4: { noteName: "C", display: "C", color: "white", offset: false },
  Db4: { noteName: "Db", display: "Db", color: "black", offset: false },
  D4: { noteName: "D", display: "D", color: "white", offset: true },
  Eb4: { noteName: "Eb", display: "Eb", color: "black", offset: false },
  E4: { noteName: "E", display: "E", color: "white", offset: true },
  F4: { noteName: "F", display: "F", color: "white", offset: false },
  Gb4: { noteName: "Gb", display: "Gb", color: "black", offset: false },
  G4: { noteName: "G", display: "G", color: "white", offset: true },
  Ab4: { noteName: "Ab", display: "Ab", color: "black", offset: false },
  A4: { noteName: "A", display: "A", color: "white", offset: true },
  Bb4: { noteName: "Bb", display: "Bb", color: "black", offset: false },
  B4: { noteName: "B", display: "B", color: "white", offset: true },
} as const;

export const keyboardToNote: Record<string, NoteId> = {
  a: "C4",
  w: "Db4",
  s: "D4",
  e: "Eb4",
  d: "E4",
  f: "F4",
  t: "Gb4",
  g: "G4",
  y: "Ab4",
  h: "A4",
  u: "Bb4",
  j: "B4",
};

export const audioCache: Record<string, HTMLAudioElement> = {};
Object.keys(pianoKeys).forEach((noteId) => {
  audioCache[noteId] = new Audio(`/assets/piano/${noteId}.mp3`);
});

// Narration Content
export const pianoFeedback = {
  default: [
    " ",
    "You sit carefully on the piano stool and prepare to play.",
    "There is a book of music, titled '100 Nursery Rhymes for Piano' resting on the music stand.",
    " ",
  ],
  failureMessages: [
    "You finish your piece and sit back...but nothing happens.",
    "As you finish, ...nothing happens.",
    "The final notes die away in the air, ...nothing happens.",
    "The room is filled with the sound of ...silence.",
    "You complete your song, but nothing happens.",
    "You scratch your head, and try to think of the right tune...",
    "You finish playing, and experience the sensation that this was not the right tune.",
  ],
  clueMessages: [
    "You stare at the pages of the music book in front of you, looking for inspiration.",
    "'100 Nursery Rhymes for beginners' stares back at you as you consider your next piece.",
    "As you look around for inspiration, the old telescope catches your eye.",
    "The telescope appears to be trained on something up in the night sky. You ponder its significance as you search for the right tune.",
    "It must be getting late - you can see stars shining in the night sky.",
    "One star in particular catches your eye - it seems to be glistening...",
    "You feel certain that the tiny, distant star holds some significance here...",
  ],
  morecombeQuote:
    "You get the strange sensation that you were playing all the right notes, but not necessarily in the right order.",
  success: [
    "Suddenly the room is full of mice squealing and running in all directions. Several mice are running up and down the piano keyboard while others appear to be dragging something into the room. The noise is deafening. Then they disappear as quickly as they came. All is quiet again.",
    "As you look around, you notice a small glass bottle full of a blue liquid, and a phial containing some very pink liquid lying on the ground.",
  ],
  partialSuccess:
    "You feel confident that you are playing all the right notes, but need to play some more...",

  storyLineSuccess:
    "The mice have all disappeared, but they have left two items lying on the ground in front of you.",
  storyLineFailure:
    "You step away from the piano feeling that there is still a tune to be played on it...but what tune?",
};

export const getSequentialMatchCountMessage = (count: number) => {
  return count === 0
    ? "You feel that you started your piece on the wrong note..."
    : `You feel that your first ${String(count)} notes were correct...`;
};

export const getRandomFailureMessage = () => {
  return pianoFeedback.failureMessages[
    Math.floor(Math.random() * pianoFeedback.failureMessages.length)
  ];
};
let clueIndex = pianoFeedback.clueMessages.length - 1;
export const getNextClueMessage = () => {
  clueIndex = (clueIndex + 1) % pianoFeedback.clueMessages.length;
  return pianoFeedback.clueMessages[clueIndex];
};

//Initial State
export const initialPianoState: PianoState = {
  playedNotes: [],
  attempts: 0,
  feedback: [...pianoFeedback.default],
  puzzleCompleted: false,
};
