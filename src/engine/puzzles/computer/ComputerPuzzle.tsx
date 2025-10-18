import { Box, Card, Stack, TextField, Typography } from "@mui/material";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { useGameStore } from "../../../store/useGameStore";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { computerReducer } from "./computerReducer";

// Types
type ComputerDisplayProps = {
  handleKeyDown: (
    key: string,
    userInput: string,
    clearUserInput: () => void,
    recursionLevel: number
  ) => void;
  recursionLevel: number;
};

export const ComputerPuzzle = () => {
  // State
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.computer.puzzleCompleted
  );

  // Handlers
  const handleReset = () => {};
  const handleLeave = () => {};
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
          backgroundColor: "orange",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            zIndex: 1,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            border: "2px solid white",
          }}
        >
          <ComputerDisplay handleKeyDown={handleKeyDown} recursionLevel={0} />
        </Box>
        {/* <Box
          sx={{
            position: "absolute",
            zIndex: 2,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            border: "2px solid white",
          }}
        >
          <ComputerDisplaay />
        </Box> */}
        <Box
          sx={{
            position: "absolute",
            zIndex: 3,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            border: "2px solid white",
          }}
        >
          <ComputerDisplaaay handleKeyDown={handleKeyDown} recursionLevel={2} />
        </Box>
      </Box>
      <PuzzleActions
        handleReset={handleReset}
        handleLeave={handleLeave}
        puzzleCompleted={puzzleCompleted}
      ></PuzzleActions>
    </PuzzleContainer>
  );
};

const ComputerDisplay = ({
  handleKeyDown,
  recursionLevel,
}: ComputerDisplayProps) => {
  return (
    <Stack
      sx={{
        backgroundColor: "green",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        border: "2px solid white",
      }}
    >
      <ComputerFeedback />
      <ComputerInput
        handleKeyDown={handleKeyDown}
        recursionLevel={recursionLevel}
      />
    </Stack>
  );
};

const ComputerDisplaay = ({
  handleKeyDown,
  recursionLevel,
}: ComputerDisplayProps) => {
  return (
    <Stack
      sx={{
        backgroundColor: "blue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90%",
        width: "90%",
        border: "2px solid white",
      }}
    >
      <ComputerFeedback />
      <ComputerInput
        handleKeyDown={handleKeyDown}
        recursionLevel={recursionLevel}
      />
    </Stack>
  );
};

const ComputerDisplaaay = ({
  handleKeyDown,
  recursionLevel,
}: ComputerDisplayProps) => {
  return (
    <Stack
      sx={{
        backgroundColor: "red",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80%",
        width: "80%",
        border: "2px solid white",
      }}
    >
      <ComputerFeedback />
      <ComputerInput
        handleKeyDown={handleKeyDown}
        recursionLevel={recursionLevel}
      />
    </Stack>
  );
};

const ComputerFeedback = () => {
  const feedback = useGameStore((state) => state.puzzleState.computer.feedback);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [feedback]);

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
      {feedback[0].slice(-30).map((entry, index) => (
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
  const [userInput, setUserInput] = useState("testing");
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
