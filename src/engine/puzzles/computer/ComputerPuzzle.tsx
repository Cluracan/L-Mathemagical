import { Box, Card, Stack, TextField, Typography } from "@mui/material";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { useGameStore } from "../../../store/useGameStore";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { computerReducer } from "./computerReducer";
import { computerFeedback, initialComputerState } from "./computerConstants";

// Types
interface ComputerDisplayProps {
  handleKeyDown: (
    key: string,
    userInput: string,
    clearUserInput: () => void,
    recursionLevel: number
  ) => void;
  recursionLevel: number;
}

interface ComputerFeedbackProps {
  recursionLevel: number;
}

export const ComputerPuzzle = () => {
  // State
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.computer.puzzleCompleted
  );
  const recursionLevel = useGameStore(
    (state) => state.puzzleState.computer.recursionLevel
  );

  // Handlers
  const handleReset = () => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        computer: computerReducer(state.puzzleState.computer, {
          type: "reset",
        }),
      },
    }));
  };
  const handleLeave = () => {
    const state = useGameStore.getState();
    if (recursionLevel > 0) {
      useGameStore.setState({
        puzzleState: {
          ...state.puzzleState,
          computer: {
            ...state.puzzleState.computer,
            recursionLevel: recursionLevel - 1,
          },
        },
      });
    } else {
      useGameStore.setState({
        showDialog: false,
        currentPuzzle: null,
        puzzleState: {
          ...state.puzzleState,
          computer: initialComputerState,
          // ...or only allow one 'go'?
          //   computer: { ...state.puzzleState.computer, puzzleCompleted: true },
        },
        storyLine: [...state.storyLine, computerFeedback.storyLineSuccess],
      });
    }
  };
  const handleKeyDown = (
    key: string,
    userInput: string,
    clearUserInput: () => void,
    recursionLevel: number
  ) => {
    if (key === "Enter") {
      handleSubmit(userInput, recursionLevel);
      clearUserInput();
    }
  };
  const handleSubmit = (userInput: string, recursionLevel: number) => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        computer: computerReducer(state.puzzleState.computer, {
          type: "submit",
          userInput,
          recursionLevel,
        }),
      },
    }));
  };
  return (
    <PuzzleContainer>
      <Box
        sx={{
          position: "relative",
          minHeight: "50vh",
          width: "100%",
        }}
      >
        {recursionLevel >= 0 && (
          <RecursionLayer handleKeyDown={handleKeyDown} recursionLevel={0} />
        )}
        {recursionLevel >= 1 && (
          <RecursionLayer handleKeyDown={handleKeyDown} recursionLevel={1} />
        )}
        {recursionLevel >= 2 && (
          <RecursionLayer handleKeyDown={handleKeyDown} recursionLevel={2} />
        )}
      </Box>
      <PuzzleActions
        handleReset={handleReset}
        handleLeave={handleLeave}
        puzzleCompleted={puzzleCompleted}
      ></PuzzleActions>
    </PuzzleContainer>
  );
};

const RecursionLayer = ({
  handleKeyDown,
  recursionLevel,
}: ComputerDisplayProps) => {
  const zIndexValue = String(recursionLevel + 1);
  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: { zIndexValue },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <ComputerDisplay
        handleKeyDown={handleKeyDown}
        recursionLevel={recursionLevel}
      />
    </Box>
  );
};

const ComputerDisplay = ({
  handleKeyDown,
  recursionLevel,
}: ComputerDisplayProps) => {
  const dimensionScaleFactor = `${String((10 - recursionLevel) * 10)}%`;
  return (
    <Stack
      sx={{
        height: dimensionScaleFactor,
        width: dimensionScaleFactor,
        border: "1px solid white",
        backgroundColor: "#272727df",
      }}
    >
      <ComputerFeedback recursionLevel={recursionLevel} />
      <ComputerInput
        handleKeyDown={handleKeyDown}
        recursionLevel={recursionLevel}
      />
    </Stack>
  );
};

const ComputerFeedback = ({ recursionLevel }: ComputerFeedbackProps) => {
  const feedback = useGameStore(
    (state) => state.puzzleState.computer.feedback[recursionLevel]
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [feedback.length]);

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        padding: 2,
        overflowY: "auto",
        whiteSpace: "pre-wrap",
      }}
    >
      {feedback.slice(-30).map((entry, index) => (
        <Typography key={index} sx={{ mb: 1, fontSize: "1rem" }}>
          {entry}
        </Typography>
      ))}
      <div ref={bottomRef} />
    </Card>
  );
};

const ComputerInput = ({
  handleKeyDown,
  recursionLevel,
}: ComputerDisplayProps) => {
  const [userInput, setUserInput] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };
  const clearUserInput = () => {
    setUserInput("");
  };

  return (
    <TextField
      autoFocus
      fullWidth
      onKeyDown={(e) => {
        handleKeyDown(e.key, userInput, clearUserInput, recursionLevel);
      }}
      onChange={handleChange}
      value={userInput}
    />
  );
};
