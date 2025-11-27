import { Box, Button, Stack, useTheme } from "@mui/material";
import { useGameStore } from "../../../store/useGameStore";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import { lightsReducer } from "./lightsReducer";
import { INITAL_ORDER, lightsFeedback } from "./lightsConstants";

export const LightsPuzzle = () => {
  // State
  const feedback = useGameStore((state) => state.puzzleState.lights.feedback);
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.lights.puzzleCompleted
  );
  const switchesActive = useGameStore(
    (state) => state.puzzleState.lights.switchesActive
  );

  // Handlers
  const handleClick = (switchIndex: number) => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        lights: lightsReducer(state.puzzleState.lights, {
          type: "input",
          button: switchIndex,
        }),
      },
    }));
  };

  const handleReset = () => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        lights: lightsReducer(state.puzzleState.lights, {
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
        lights: {
          ...state.puzzleState.lights,
          curOrder: [...INITAL_ORDER],
          feedback: lightsFeedback.initial,
          turns: 0,
          switchesActive: true,
        },
      },
      storyLine: [
        ...state.storyLine,
        {
          type: "description",
          text: state.puzzleState.lights.puzzleCompleted
            ? lightsFeedback.storyLineSuccess
            : lightsFeedback.storyLineFailure,
          isEncrypted: state.encryptionActive,
        },
      ],
      itemLocation: {
        ...state.itemLocation,
        ...(state.puzzleState.lights.puzzleCompleted && { oar: "lights" }),
      },
    }));
  };

  // Render
  return (
    <>
      <PuzzleContainer>
        <PuzzleHeader
          title="Lights Puzzle"
          description="Put the lights into alphabetical order"
        />
        <LightsDisplay />
        <PuzzleFeedback feedback={feedback.slice(-20)} height="30vh" />

        <PuzzleActions
          puzzleCompleted={puzzleCompleted}
          handleReset={handleReset}
          handleLeave={handleLeave}
        >
          <Box>
            {[1, 2, 3, 4].map((value) => (
              <Button
                variant="contained"
                size="large"
                key={value}
                sx={{ m: 2 }}
                onClick={() => {
                  handleClick(value);
                }}
                disabled={!switchesActive}
              >
                {value}
              </Button>
            ))}
          </Box>
        </PuzzleActions>
      </PuzzleContainer>
    </>
  );
};

const LightsDisplay = () => {
  const theme = useTheme();
  const curOrder = useGameStore((state) => state.puzzleState.lights.curOrder);
  return (
    <Stack
      direction={"row"}
      width={"80%"}
      p={{ md: 2, lg: 4 }}
      m={{ md: 0, lg: 2 }}
      sx={{
        justifyContent: "space-around",
      }}
    >
      {curOrder.map((color) => (
        <div
          key={color}
          style={{
            color: "black",
            backgroundColor: color,
            borderRadius: "100%",
            height: theme.spacing(12),
            width: theme.spacing(12),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {color}
        </div>
      ))}
    </Stack>
  );
};
