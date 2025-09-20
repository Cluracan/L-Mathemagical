export const pianoKeys = {
  C: { audioId: "C4", display: "C", color: "white" },
  Db: { audioId: "Db4", display: "Db", color: "black" },
  D: { audioId: "D4", display: "D", color: "white" },
  Eb: { audioId: "Eb4", display: "Eb", color: "black" },
  E: { audioId: "E4", display: "E", color: "white" },
  F: { audioId: "F4", display: "F", color: "white" },
  Gb: { audioId: "Gb4", display: "Gb", color: "black" },
  G: { audioId: "G4", display: "G", color: "white" },
  Ab: { audioId: "Ab4", display: "Ab", color: "black" },
  A: { audioId: "A4", display: "A", color: "white" },
  Bb: { audioId: "Bb4", display: "Bb", color: "black" },
  B: { audioId: "B4", display: "B", color: "white" },
} as const;

export type NoteName = keyof typeof pianoKeys;
export type NoteId = (typeof pianoKeys)[NoteName]["audioId"];

export const audioCache: Record<string, HTMLAudioElement> = {};
Object.values(pianoKeys).forEach((keyInfo) => {
  audioCache[keyInfo.audioId] = new Audio(
    `/assets/piano/${keyInfo.audioId}.mp3`
  );
});

export type PianoState = {
  playedNotes: NoteName[];
  feedback: string[];
  puzzleCompleted: boolean;
};

export const initialPianoState: PianoState = {
  playedNotes: [],
  feedback: ["Piano feedback (initial"],
  puzzleCompleted: false,
};
