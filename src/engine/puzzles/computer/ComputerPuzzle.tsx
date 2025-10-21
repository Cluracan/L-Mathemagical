import { Box, Card, TextField, Typography } from "@mui/material";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { useGameStore } from "../../../store/useGameStore";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { computerReducer } from "./computerReducer";
import { computerFeedback, initialComputerState } from "./computerConstants";

// Types
interface ComputerScreenProps {
  handleKeyDown: (
    key: string,
    userInput: string,
    clearUserInput: () => void,
    recursionLevel: number
  ) => void;
  recursionLevel: number;
  isFocused: boolean;
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
      useGameStore.setState((state) => ({
        puzzleState: {
          ...state.puzzleState,
          computer: computerReducer(state.puzzleState.computer, {
            type: "leave",
          }),
        },
      }));
    } else {
      useGameStore.setState({
        showDialog: false,
        currentPuzzle: null,
        puzzleState: {
          ...state.puzzleState,
          computer: initialComputerState,
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
          keyLocked: state.keyLocked,
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
          <RecursionLayer
            handleKeyDown={handleKeyDown}
            recursionLevel={0}
            isFocused={recursionLevel === 0}
          />
        )}
        {recursionLevel >= 1 && (
          <RecursionLayer
            handleKeyDown={handleKeyDown}
            recursionLevel={1}
            isFocused={recursionLevel === 1}
          />
        )}
        {recursionLevel >= 2 && (
          <RecursionLayer
            handleKeyDown={handleKeyDown}
            recursionLevel={2}
            isFocused={recursionLevel === 2}
          />
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
  isFocused,
}: ComputerScreenProps) => {
  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: recursionLevel + 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <ComputerScreen
        handleKeyDown={handleKeyDown}
        recursionLevel={recursionLevel}
        isFocused={isFocused}
      />
    </Box>
  );
};

const ComputerScreen = ({
  handleKeyDown,
  recursionLevel,
  isFocused,
}: ComputerScreenProps) => {
  return (
    <Card
      sx={{
        transform: `scale(${String(1 - recursionLevel * 0.1)})`,
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid white",
        // backgroundColor: "background.paper",
      }}
    >
      <ComputerFeedback recursionLevel={recursionLevel} />
      <ComputerInput
        handleKeyDown={handleKeyDown}
        recursionLevel={recursionLevel}
        isFocused={isFocused}
      />
    </Card>
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
        <Typography key={index} sx={{ mb: 1 }}>
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
  isFocused,
}: ComputerScreenProps) => {
  const [userInput, setUserInput] = useState("");
  const inputRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus();
    }
  }, [isFocused]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };
  const clearUserInput = () => {
    setUserInput("");
  };

  return (
    <TextField
      inputRef={inputRef}
      autoFocus={isFocused}
      fullWidth
      onKeyDown={(e) => {
        handleKeyDown(e.key, userInput, clearUserInput, recursionLevel);
      }}
      onChange={handleChange}
      value={userInput}
    />
  );
};
