import { useCallback, useEffect } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";
import {
  initialTelephoneState,
  telephoneFeedback,
  telephoneButtons,
  type TelephoneButton,
} from "./telephoneConstants";
import { telephoneReducer } from "./telephoneReducer";

// Types
type InputHandler = (button: TelephoneButton) => void;

interface TelephoneProps {
  onClick: InputHandler;
}

interface TelephoneButtonProps {
  value: number | null;
  onClick: InputHandler;
}

export const TelephonePuzzle = () => {
  // State
  const feedback = useGameStore(
    (state) => state.puzzleState.telephone.feedback
  );
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.telephone.puzzleCompleted
  );

  // Handlers
  const handleReset = () => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        telephone: telephoneReducer(state.puzzleState.telephone, {
          type: "reset",
        }),
      },
    }));
  };

  const handleLeave = () => {
    const state = useGameStore.getState();
    const puzzleCompleted = state.puzzleState.telephone.puzzleCompleted;
    useGameStore.setState({
      showDialog: false,
      currentPuzzle: null,
      puzzleState: { ...state.puzzleState, telephone: initialTelephoneState },
      storyLine: [
        ...state.storyLine,
        {
          type: "description",
          text: puzzleCompleted
            ? telephoneFeedback.storyLineSuccess
            : telephoneFeedback.storyLineFailure,
          isEncrypted: state.encryptionActive,
        },
      ],
    });
  };

  const handleInput: InputHandler = useCallback((button) => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        telephone: telephoneReducer(state.puzzleState.telephone, {
          type: "input",
          value: Number(button),
        }),
      },
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        telephone: telephoneReducer(state.puzzleState.telephone, {
          type: "submit",
        }),
      },
    }));
  }, []);

  // Effects
  useEffect(() => {
    function keyDownHandler(e: KeyboardEvent) {
      if (!isNaN(Number(e.key))) {
        e.preventDefault();
        handleInput(Number(e.key));
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    }
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [handleSubmit, handleInput]);

  // Render
  return (
    <PuzzleContainer>
      <PuzzleHeader
        title="Telephone Puzzle"
        description="Dial the correct number"
      />

      <Telephone onClick={handleInput} />

      <PuzzleFeedback feedback={feedback} height="30vh" />
      <PuzzleActions
        handleReset={handleReset}
        handleLeave={handleLeave}
        puzzleCompleted={puzzleCompleted}
      >
        <Button
          disabled={puzzleCompleted}
          variant="contained"
          size="large"
          onClick={handleSubmit}
        >
          Dial
        </Button>
      </PuzzleActions>
    </PuzzleContainer>
  );
};

const Telephone = ({ onClick }: TelephoneProps) => {
  return (
    <Stack
      direction={"row"}
      sx={{
        justifyContent: "space-around",
        alignItems: "center",
        width: "60%",
      }}
    >
      <TelephoneKeypad onClick={onClick} />
      <NumberDisplay />
    </Stack>
  );
};

const TelephoneKeypad = ({ onClick }: TelephoneProps) => {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          borderRadius: "5px",
          m: 2,
          padding: 2,
          backgroundColor: "#d7bc83",
        }}
      >
        {telephoneButtons.map((value, index) => (
          <TelephoneButton onClick={onClick} value={value} key={index} />
        ))}
      </Box>
    </>
  );
};

const TelephoneButton = ({ onClick, value }: TelephoneButtonProps) => {
  const isButton = value !== null;
  return isButton ? (
    <Button
      onClick={() => {
        onClick(value);
      }}
      sx={{
        border: "1px solid rgb(47, 47, 47)",
        borderRadius: "5px",
        boxShadow: " inset 0px 0px 3px 0px #988e6fff",
        color: "rgb(47, 47, 47)",
        backgroundColor: "#f1e2b0",
        fontFamily: "Orbitron",
        "&:hover": {
          boxShadow: "inset 0px 0px 6px 0px #988e6fff",
        },
      }}
    >
      {value}
    </Button>
  ) : (
    <Box
      sx={{
        border: "1px solid rgba(21, 21, 21, 1)",
        borderRadius: "5px",
        backgroundColor: "#d7bc83",
      }}
    />
  );
};

const NumberDisplay = () => {
  const number = useGameStore((state) => state.puzzleState.telephone.number);
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
        {number.toString().padStart(3, "0")}
      </Typography>
    </>
  );
};
