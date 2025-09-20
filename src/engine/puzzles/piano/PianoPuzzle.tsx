import { Button, Stack } from "@mui/material";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";
import { pianoKeys, type NoteId } from "./pianoConstants";

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

  //   const handleNotePress = () => {};

  return (
    <PuzzleContainer>
      <PuzzleHeader title="Piano Puzzle" description="Play the right tune." />
      <Stack direction={"row"}>
        {Object.values(pianoKeys).map((pianoKeyInfo) => (
          <Button
            key={pianoKeyInfo.audioId}
            onClick={() => playAudioNote(pianoKeyInfo.audioId)}
          >
            {pianoKeyInfo.display}
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

const audioCache: Record<string, HTMLAudioElement> = {};
Object.values(pianoKeys).forEach((keyInfo) => {
  audioCache[keyInfo.audioId] = new Audio(
    `/assets/piano/${keyInfo.audioId}.mp3`
  );
});

const playAudioNote = (note: NoteId) => {
  const audio = audioCache[note];
  if (!audio) return;
  (audio.cloneNode(true) as HTMLAudioElement).play();
};
