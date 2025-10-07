import { Box, Button, Stack, Typography } from "@mui/material";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";
import {
  DIGIT_COUNT,
  initialSafeState,
  keypadValues,
  safeFeedback,
  type KeypadButton,
} from "./safeConstants";
import { safeReducer } from "./safeReducer";

export const SafePuzzle = () => {
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.safe.puzzleCompleted
  );

  const handleReset = () => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        safe: safeReducer(state.puzzleState.safe, {
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
        safe: {
          ...initialSafeState,
          puzzleCompleted: state.puzzleState.safe.puzzleCompleted,
        },
      },
      storyLine: [
        ...state.storyLine,
        state.puzzleState.safe.puzzleCompleted
          ? safeFeedback.storyLineSuccess
          : safeFeedback.storyLineFailure,
      ],
    }));
  };
  const handleInput = (button: KeypadButton) => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        safe: safeReducer(state.puzzleState.safe, {
          type: "input",
          value: button,
        }),
      },
    }));
  };
  const handleTest = () => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        safe: safeReducer(state.puzzleState.safe, {
          type: "test",
        }),
      },
    }));
  };
  return (
    <PuzzleContainer>
      <PuzzleHeader title="Safe Puzzle" description="Crack the code." />
      <Keypad onClick={handleInput} />
      <PuzzleActions
        handleReset={handleReset}
        handleLeave={handleLeave}
        puzzleCompleted={puzzleCompleted}
      >
        <Button
          disabled={puzzleCompleted}
          variant="contained"
          size="large"
          onClick={handleTest}
        >
          Test
        </Button>
      </PuzzleActions>
    </PuzzleContainer>
  );
};

interface KeypadProps {
  onClick: (button: KeypadButton) => void;
}
const Keypad = ({ onClick }: KeypadProps) => {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1,
          borderRadius: "5px",
          m: 2,
          padding: 2,
          backgroundColor: "#a2a1a7",
        }}
      >
        {keypadValues.map((value, index) => (
          <KeypadButton onClick={onClick} value={value} key={index} />
        ))}
      </Box>
      <KeypadDisplay />
      <KeypadFeedback />
    </>
  );
};

interface KeypadButtonProps {
  onClick: (button: KeypadButton) => void;
  value: KeypadButton;
}
const KeypadButton = ({ onClick, value }: KeypadButtonProps) => {
  return (
    <Button
      onClick={() => {
        onClick(value);
      }}
      sx={{
        border: "1px solid rgb(47, 47, 47)",
        borderRadius: "5px",
        boxShadow: " inset 0px 0px 3px 0px #988e6fff",
        color: "rgb(47, 47, 47)",
        backgroundColor: "#cbc5c5",
        fontFamily: "Orbitron",
        "&:hover": {
          boxShadow: "inset 0px 0px 6px 0px #988e6fff",
        },
      }}
    >
      {value}
    </Button>
  );
};

const KeypadDisplay = () => {
  const value = useGameStore((state) => state.puzzleState.safe.value);
  return (
    <>
      <Typography
        sx={{
          px: 1,
          border: "3px solid rgba(71, 71, 71, 1)",
          borderRadius: 1,
          color: "rgb(60, 60, 60)",
          backgroundColor: "rgb(189, 212, 189)",
          boxShadow: "inset -10px -5px 64px -32px #2b382e",
          fontFamily: "DSEG7",
          fontSize: "2rem",
        }}
      >
        {value.toString().padStart(DIGIT_COUNT, "0")}
      </Typography>
    </>
  );
};

const KeypadFeedback = () => {
  const feedback = useGameStore((state) => state.puzzleState.safe.feedback);
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.safe.puzzleCompleted
  );
  const feedbackLights = [
    { color: "rgba(255, 0, 0, 1)", isActive: !puzzleCompleted },
    { color: "rgba(255, 196, 0, 1)", isActive: feedback.isCorrectDigitCount },
    { color: "rgba(255, 255, 0, 1)", isActive: feedback.isSquare },
    { color: "rgba(204, 255, 0, 1)", isActive: feedback.isCube },
    { color: "rgba(0, 255, 17, 1)", isActive: puzzleCompleted },
  ];
  return (
    <Stack direction={"row"} sx={{ gap: 2 }}>
      {feedbackLights.map((light) => (
        <Box
          sx={{
            width: "1rem",
            height: "1rem",
            border: `1px solid ${light.color}`,
            borderRadius: "50%",
            backgroundColor: light.isActive ? light.color : "none",
          }}
        ></Box>
      ))}
    </Stack>
  );
};
