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
import { Box, Button, Stack, Typography } from "@mui/material";
import { telephoneReducer } from "./telephoneReducer";
import { useEffect } from "react";

//Types
type InputHandler = (button: TelephoneButton) => void;

export const TelephonePuzzle = () => {
  // --- state / selectors ---
  const feedback = useGameStore(
    (state) => state.puzzleState.telephone.feedback
  );
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.telephone.puzzleCompleted
  );
  const number = useGameStore((state) => state.puzzleState.telephone.number);

  // --- effects ---
  useEffect(() => {
    function keyDownHandler(e: KeyboardEvent) {
      console.log(e.key);
      if (!isNaN(Number(e.key))) {
        handleInput(Number(e.key));
      } else if (e.key === "Enter") {
        handleSubmit();
      }
    }
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  // --- handlers ---
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
        puzzleCompleted
          ? telephoneFeedback.storyLineSuccess
          : telephoneFeedback.storyLineFailure,
      ],
    });
  };

  const handleInput: InputHandler = (button) => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        telephone: telephoneReducer(state.puzzleState.telephone, {
          type: "input",
          value: Number(button),
        }),
      },
    }));
  };

  const handleSubmit = () => {
    console.log(useGameStore.getState().puzzleState.telephone);
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        telephone: telephoneReducer(state.puzzleState.telephone, {
          type: "submit",
        }),
      },
    }));
  };

  return (
    <PuzzleContainer>
      <PuzzleHeader
        title="Telephone Puzzle"
        description="Dial the correct number"
      />
      <Stack
        direction={"row"}
        sx={{
          justifyContent: "space-around",
          alignItems: "center",
          width: "60%",
        }}
      >
        <Telephone onClick={handleInput} />
        <NumberDisplay number={number} />
      </Stack>
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

interface TelephoneProps {
  onClick: InputHandler;
}
const Telephone = ({ onClick }: TelephoneProps) => {
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

interface TelephoneButtonProps {
  value: number | null;
  onClick: InputHandler;
}
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

interface NumberDisplayProps {
  number: number;
}
const NumberDisplay = ({ number }: NumberDisplayProps) => {
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
