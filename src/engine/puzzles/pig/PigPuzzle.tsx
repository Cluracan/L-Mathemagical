import { Box } from "@mui/material";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { ORCHARD_WIDTH } from "../tree/treeConstants";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import { useGameStore } from "../../../store/useGameStore";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { memo, useEffect } from "react";
import { GRID_SIZE } from "./pigConstants";
import pig from "../../../assets/images/pig.svg";
import player from "../../../assets/images/person.svg";
import pigCaptured from "../../../assets/images/pigCaptured.svg";
import { produce } from "immer";
export const PigPuzzle = () => {
  const feedback = useGameStore((state) => state.puzzleState.pig.feedback);
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.pig.puzzleCompleted
  );

  useEffect(() => {
    function keyDownHandler(e: globalThis.KeyboardEvent) {
      console.log(e.key.toLowerCase());
      useGameStore.setState((state) =>
        produce(state, (draft) => {
          draft.puzzleState.pig.playerLocation =
            (draft.puzzleState.pig.playerLocation + 1) % 25;
        })
      );
    }
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  const handleReset = () => {};

  const handleLeave = () => {};

  return (
    <PuzzleContainer>
      <PuzzleHeader title="Pig Puzzle" description="Catch the pig!" />
      <PuzzleGrid />
      <PuzzleFeedback feedback={feedback} height="20vh" />
      <PuzzleActions
        puzzleCompleted={puzzleCompleted}
        handleReset={handleReset}
        handleLeave={handleLeave}
      />
    </PuzzleContainer>
  );
};
const PuzzleGrid = () => {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${ORCHARD_WIDTH}, 1fr)`,
          gap: "1px",
          width: "50vh",
          margin: 1,
          backgroundColor: "pink",
        }}
      >
        {Array.from({ length: GRID_SIZE }, (_, i) => i).map((i) => (
          <GridCell index={i} />
        ))}
      </Box>
    </>
  );
};

const GridCell = memo(({ index }: { index: number }) => {
  const playerLocation = useGameStore(
    (state) => state.puzzleState.pig.playerLocation
  );
  const pigLocation = useGameStore(
    (state) => state.puzzleState.pig.pigLocation
  );
  let imageSrc = null;
  if (playerLocation === index && pigLocation === index) {
    imageSrc = pigCaptured;
  } else {
    if (playerLocation == index) {
      imageSrc = player;
    } else if (pigLocation === index) {
      imageSrc = pig;
    }
  }
  return (
    <Box
      key={index}
      sx={{
        aspectRatio: "1/1",
        backgroundColor: "grey",
        overflow: "hidden",
      }}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </Box>
  );
});
