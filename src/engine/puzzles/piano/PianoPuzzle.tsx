import { Button, Stack } from "@mui/material";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";

export const PianoPuzzle = () => {
  const feedback = useGameStore((state) => state.puzzleState.piano.feedback);
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.piano.puzzleCompleted
  );
  const handleReset = () => {
    console.log("reset");
  };

  const handleLeave = () => {
    console.log("leave");
  };

  //   const handleClickNote = () => {};

  return (
    <PuzzleContainer>
      <PuzzleHeader title="Piano Puzzle" description="Play the right tune." />
      <Stack direction={"row"}>
        {Object.values(pianoKeys).map((keyInfo) => (
          <Button key={keyInfo.id} onClick={() => playNote(keyInfo.id)}>
            {keyInfo.display}
          </Button>
        ))}
      </Stack>
      <PuzzleFeedback height="20vh" feedback={feedback} />
      <PuzzleActions
        handleReset={handleReset}
        handleLeave={handleLeave}
        puzzleCompleted={puzzleCompleted}
      ></PuzzleActions>
    </PuzzleContainer>
  );
};

// const PianoKeyboard = () => {};

const pianoKeys = {
  C: { id: "C4", display: "C", color: "white" },
  Db: { id: "Db4", display: "Db", color: "black" },
  D: { id: "D4", display: "D", color: "white" },
  Eb: { id: "Eb4", display: "Eb", color: "black" },
  E: { id: "E4", display: "E", color: "white" },
  F: { id: "F4", display: "F", color: "white" },
  Gb: { id: "Gb4", display: "Gb", color: "black" },
  G: { id: "G4", display: "G", color: "white" },
  Ab: { id: "Ab4", display: "Ab", color: "black" },
  A: { id: "A4", display: "A", color: "white" },
  Bb: { id: "Bb4", display: "Bb", color: "black" },
  B: { id: "B4", display: "B", color: "white" },
} as const;

type KeyName = keyof typeof pianoKeys;
type keyId = (typeof pianoKeys)[KeyName]["id"];

const audioSamples: Record<string, HTMLAudioElement> = {};
Object.values(pianoKeys).forEach((keyInfo) => {
  audioSamples[keyInfo.id] = new Audio(`/assets/piano/${keyInfo.id}.mp3`);
});

const playNote = (note: keyId) => {
  const audio = audioSamples[note];
  if (!audio) return;
  (audio.cloneNode(true) as HTMLAudioElement).play();
};
