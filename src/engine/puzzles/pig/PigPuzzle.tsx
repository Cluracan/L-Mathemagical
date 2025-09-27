import {
  Box,
  Button,
  Card,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Paper,
  Snackbar,
  Stack,
  styled,
  Switch,
  Typography,
} from "@mui/material";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { ORCHARD_WIDTH } from "../tree/treeConstants";
import { useGameStore } from "../../../store/useGameStore";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { memo, useEffect } from "react";
import {
  directionAliases,
  GRID_SIZE,
  initialPigState,
  isDirectionAlias,
  pigFeedback,
} from "./pigConstants";
import pig from "../../../assets/images/pig.svg";
import player from "../../../assets/images/person.svg";
import pigCaptured from "../../../assets/images/pigCaptured.svg";
import { produce } from "immer";
import { pigReducer } from "./pigReducer";

export const PigPuzzle = () => {
  const feedback = useGameStore((state) => state.puzzleState.pig.feedback);
  const showFeedback = useGameStore(
    (state) => state.puzzleState.pig.showFeedback
  );
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.pig.puzzleCompleted
  );
  const showInstructions = useGameStore(
    (state) => state.puzzleState.pig.showInstructions
  );

  useEffect(() => {
    function keyDownHandler(e: globalThis.KeyboardEvent) {
      if (!isDirectionAlias(e.key)) return;
      console.log(directionAliases[e.key]);
      useGameStore.setState((state) =>
        produce(state, (draft) => {
          draft.puzzleState.pig = pigReducer(draft.puzzleState.pig, {
            type: "movement",
            direction: directionAliases[e.key],
          });
        })
      );
    }
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  const handleReset = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.pig = pigReducer(draft.puzzleState.pig, {
          type: "reset",
        });
      })
    );
  };

  const handleLeave = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.showDialog = false;
        draft.currentPuzzle = null;
        if (draft.puzzleState.pig.puzzleCompleted) {
          draft.storyLine.push(pigFeedback.storyLineSuccess);
        } else {
          draft.puzzleState.pig = initialPigState;
          draft.storyLine.push(pigFeedback.storyLineFailure);
        }
      })
    );
  };

  const closeFeedback = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.pig.showFeedback = false;
      })
    );
  };

  return (
    <PuzzleContainer>
      <PuzzleHeader title="Pig Puzzle" description="Catch the pig!" />
      {showInstructions && <Instructions />}
      {!showInstructions && (
        <>
          <PuzzleGrid />
          <PuzzleActions
            puzzleCompleted={puzzleCompleted}
            handleReset={handleReset}
            handleLeave={handleLeave}
          />
        </>
      )}
      <Snackbar
        open={showFeedback}
        onClose={closeFeedback}
        autoHideDuration={puzzleCompleted ? null : 2000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message={feedback}
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
          <GridCell key={i} index={i} />
        ))}
      </Box>
    </>
  );
};

const GridCell = memo(({ index }: { index: number }) => {
  const playerPresent = useGameStore(
    (state) => state.puzzleState.pig.playerLocation === index
  );
  const pigPresent = useGameStore(
    (state) => state.puzzleState.pig.pigLocation === index
  );
  let imageSrc = null;
  if (playerPresent && pigPresent) {
    imageSrc = pigCaptured;
  } else {
    if (playerPresent) {
      imageSrc = player;
    } else if (pigPresent) {
      imageSrc = pig;
    }
  }
  return (
    <StyledCell>
      {imageSrc && (
        <img
          src={imageSrc}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </StyledCell>
  );
});

const StyledCell = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  aspectRatio: "1 / 1",
  backgroundColor: "grey",
});

const Instructions = () => {
  const handleClick = (playerGoesFirst: boolean) => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        if (!playerGoesFirst) {
          draft.puzzleState.pig.pigLocation = initialPigState.pigLocation + 1;
          draft.puzzleState.pig.feedback = "The pig moves east...now catch it!";
        } else {
          draft.puzzleState.pig.feedback = "...catch the pig!";
        }
        draft.puzzleState.pig.showFeedback = true;
        draft.puzzleState.pig.showInstructions = false;
      })
    );
  };
  return (
    <>
      <Paper
        elevation={8}
        sx={{
          height: "40vh",
          width: "80%",
          padding: 2,
          margin: "auto",
        }}
      >
        {pigFeedback.instructions.map((entry) => (
          <Typography lineHeight={3}>{entry}</Typography>
        ))}
        <Paper
          sx={{
            width: "80%",
            display: "flex",
            justifyContent: "center",
            justifySelf: "center",
            mt: 4,
            padding: 4,
            backgroundColor: "transparent",
          }}
        >
          Would you like to go first?
          <Stack
            direction={"row"}
            sx={{ width: "80%", justifyContent: "space-around" }}
          >
            <Button variant="contained" onClick={() => handleClick(true)}>
              Yes please!
            </Button>
            <Button variant="contained" onClick={() => handleClick(false)}>
              No thanks!
            </Button>
          </Stack>
        </Paper>
      </Paper>
    </>
  );
};
