import { produce } from "immer";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";

export const ApePuzzle = () => {
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.ape.puzzleCompleted
  );
  const handleLeave = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.showDialog = false;
        draft.currentPuzzle = null;
      })
    );
  };
  const handleReset = () => {};
  return (
    <PuzzleContainer>
      <PuzzleHeader title="Ape Puzzle" description="Solve the riddle" />
      <PuzzleActions
        puzzleCompleted={puzzleCompleted}
        handleReset={handleReset}
        handleLeave={handleLeave}
      ></PuzzleActions>
    </PuzzleContainer>
  );
};
