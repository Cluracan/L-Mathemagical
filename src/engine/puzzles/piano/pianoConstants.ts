//Types
export type PianoState = {
  playedNotes: NoteName[];
  feedback: string[];
  puzzleCompleted: boolean;
};

//Constants
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

//Static Data

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
export type NoteId = keyof typeof pianoKeys;
export type NoteName = (typeof pianoKeys)[NoteId]["noteName"];

export const audioCache: Record<string, HTMLAudioElement> = {};
Object.keys(pianoKeys).forEach((noteId) => {
  audioCache[noteId] = new Audio(`/assets/piano/${noteId}.mp3`);
});

export const pianoFeedback = {};

//Initial State
export const initialPianoState: PianoState = {
  playedNotes: [],
  feedback: ["Piano feedback (initial"],
  puzzleCompleted: false,
};
