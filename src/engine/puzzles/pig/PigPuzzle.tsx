import { produce } from "immer";
import {
  Box,
  Button,
  Paper,
  Snackbar,
  Stack,
  styled,
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
  INITIAL_PIG_LOCATION,
  INITIAL_PLAYER_LOCATION,
  initialPigState,
  isDirectionAlias,
  pigFeedback,
  type CompassDirection,
} from "./pigConstants";
import pig from "../../../assets/images/pig.svg";
import player from "../../../assets/images/person.svg";
import pigCaptured from "../../../assets/images/pigCaptured.svg";
import { pigReducer } from "./pigReducer";

export const PigPuzzle = () => {
  // State
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

  // Effects
  useEffect(() => {
    function keyDownHandler(e: KeyboardEvent) {
      if (isDirectionAlias(e.key)) {
        handleInput(directionAliases[e.key]);
      }
    }

    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  // Handlers
  const handleInput = (direction: CompassDirection) => {
    useGameStore.setState((state) => ({
      ...state,
      puzzleState: {
        ...state.puzzleState,
        pig: pigReducer(state.puzzleState.pig, {
          type: "movement",
          direction,
        }),
      },
    }));
  };

  const handleReset = () => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        pig: pigReducer(state.puzzleState.pig, {
          type: "reset",
        }),
      },
    }));
  };

  const handleLeave = () => {
    useGameStore.setState((state) => ({
      showDialog: false,
      currentPuzzle: null,
      puzzleState: {
        ...state.puzzleState,
        pig: {
          ...state.puzzleState.pig,
          showInstructions: true,
          playerLocation: INITIAL_PLAYER_LOCATION,
          pigLocation: INITIAL_PIG_LOCATION,
        },
      },
      storyLine: [
        ...state.storyLine,
        {
          type: "description",
          text: state.puzzleState.pig.puzzleCompleted
            ? pigFeedback.storyLineSuccess
            : pigFeedback.storyLineFailure,
          isEncrypted: state.encryptionActive,
        },
      ],
    }));
  };

  const closeFeedback = () => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        pig: { ...state.puzzleState.pig, showFeedback: false },
      },
    }));
  };

  // Render
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

const PuzzleGrid = memo(() => {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${String(ORCHARD_WIDTH)}, 1fr)`,
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
});
PuzzleGrid.displayName = "PuzzleGrid";

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
GridCell.displayName = "GridCell";

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
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "50vh",
          width: "80%",
          padding: 4,
          margin: 4,
        }}
      >
        <div>
          {pigFeedback.instructions.map((entry, index) => (
            <Typography key={index} sx={{ lineHeight: { md: 1.5, lg: 3 } }}>
              {entry}
            </Typography>
          ))}
        </div>
        <Paper
          sx={{
            alignSelf: "center",
            justifySelf: "end",
            width: "80%",
            display: "flex",
            justifyContent: "center",
            padding: { md: 2, lg: 4 },
            backgroundColor: "transparent",
          }}
        >
          Would you like to go first?
          <Stack
            direction={"row"}
            sx={{ width: "80%", justifyContent: "space-around" }}
          >
            <Button
              variant="contained"
              onClick={() => {
                handleClick(true);
              }}
            >
              Yes please!
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleClick(false);
              }}
            >
              No thanks!
            </Button>
          </Stack>
        </Paper>
      </Paper>
    </>
  );
};
