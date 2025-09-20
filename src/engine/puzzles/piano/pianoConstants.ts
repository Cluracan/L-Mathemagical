type Note = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export type PianoState = {
  notes: Note[];
  feedback: string[];
  puzzleCompleted: boolean;
};

export const initialPianoState: PianoState = {
  notes: [],
  feedback: ["Piano feedback (initial"],
  puzzleCompleted: false,
};
