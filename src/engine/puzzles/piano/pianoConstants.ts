//Types
export type PianoState = {
  playedNotes: NoteName[];
  feedback: string[];
  puzzleCompleted: boolean;
};

//TypeAssertions
export function assertIsNoteId(noteId: string): asserts noteId is NoteId {
  if (!Object.keys(pianoKeys).includes(noteId)) throw new Error("");
}

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
  C4: { noteName: "C", display: "C", color: "white" },
  Db4: { noteName: "Db", display: "Db", color: "black" },
  D4: { noteName: "D", display: "D", color: "white" },
  Eb4: { noteName: "Eb", display: "Eb", color: "black" },
  E4: { noteName: "E", display: "E", color: "white" },
  F4: { noteName: "F", display: "F", color: "white" },
  Gb4: { noteName: "Gb", display: "Gb", color: "black" },
  G4: { noteName: "G", display: "G", color: "white" },
  Ab4: { noteName: "Ab", display: "Ab", color: "black" },
  A4: { noteName: "A", display: "A", color: "white" },
  Bb4: { noteName: "Bb", display: "Bb", color: "black" },
  B4: { noteName: "B", display: "B", color: "white" },
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
