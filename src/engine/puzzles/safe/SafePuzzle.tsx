import { Box, Button, Stack, Typography } from "@mui/material";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";
import {
  DIGIT_COUNT,
  initialSafeState,
  isKeypadButton,
  keypadButtons,
  safeFeedback,
  type KeypadButton,
} from "./safeConstants";
import { safeReducer } from "./safeReducer";
import { useCallback, useEffect } from "react";

// Types
interface SafeDisplayProps {
  onClick: (button: KeypadButton) => void;
}

interface KeypadProps {
  onClick: (button: KeypadButton) => void;
}

interface KeypadButtonProps {
  onClick: (button: KeypadButton) => void;
  button: KeypadButton;
}

export const SafePuzzle = () => {
  // State
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.safe.puzzleCompleted
  );

  // Handlers
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
      keyLocked: { ...state.keyLocked, safe: false },
    }));
  };

  const handleInput = useCallback((button: KeypadButton) => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        safe: safeReducer(state.puzzleState.safe, {
          type: "input",
          digit: button,
        }),
      },
    }));
  }, []);

  const handleTest = useCallback(() => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        safe: safeReducer(state.puzzleState.safe, {
          type: "test",
        }),
      },
    }));
  }, []);

  // Effects
  useEffect(() => {
    function keyDownHandler(e: KeyboardEvent) {
      if (!isNaN(Number(e.key))) {
        const digit = Number(e.key);
        if (isKeypadButton(digit)) {
          e.preventDefault();
          handleInput(digit);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleTest();
      }
    }
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [handleTest, handleInput]);

  // Render
  return (
    <PuzzleContainer>
      <PuzzleHeader title="Safe Puzzle" description="Crack the code." />
      <SafeDisplay onClick={handleInput} />
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
          Enter
        </Button>
      </PuzzleActions>
    </PuzzleContainer>
  );
};

const SafeDisplay = ({ onClick }: SafeDisplayProps) => {
  return (
    <Stack
      direction={"row"}
      sx={{
        p: 2,
        gap: 2,
        m: "auto",
        borderRadius: 2,
        backgroundColor: "#6c6c6dff",
      }}
    >
      <Keypad onClick={onClick} />
      <Stack sx={{ mt: 2, alignItems: "center", gap: 2 }}>
        <KeypadDisplay />
        <KeypadFeedback />
      </Stack>
    </Stack>
  );
};

const Keypad = ({ onClick }: KeypadProps) => {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1,
          borderRadius: "5px",
          padding: 2,
          backgroundColor: "#a2a1a7",
        }}
      >
        {keypadButtons.map((button, index) => (
          <KeypadButton onClick={onClick} button={button} key={index} />
        ))}
      </Box>
    </>
  );
};

const KeypadButton = ({ onClick, button }: KeypadButtonProps) => {
  return (
    <Button
      onClick={() => {
        onClick(button);
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
      {String(button)}
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
    <Stack direction={"row"} sx={{ gap: 1 }}>
      {feedbackLights.map((light, index) => (
        <Box
          key={index}
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
