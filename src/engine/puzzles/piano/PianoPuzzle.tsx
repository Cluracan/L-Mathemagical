import { Stack } from "@mui/material";
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

  return (
    <PuzzleContainer>
      <PuzzleHeader title="Piano Puzzle" description="Play the right tune." />
      <Stack></Stack>
      <PuzzleFeedback height="20vh" feedback={feedback} />
      <PuzzleActions
        handleReset={handleReset}
        handleLeave={handleLeave}
        puzzleCompleted={puzzleCompleted}
      ></PuzzleActions>
    </PuzzleContainer>
  );
};

const PianoKeyboard = () => {};

const notes = [{ noteValue: "C", color: "white" }];
