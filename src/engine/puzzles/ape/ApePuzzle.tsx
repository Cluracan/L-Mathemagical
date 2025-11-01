import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import { Button, Stack, TextField } from "@mui/material";
import { apeFeedback, INITIAL_WORD } from "./apeConstants";
import { useState, type ChangeEvent, type KeyboardEventHandler } from "react";
import { apeReducer } from "./apeReducer";

export const ApePuzzle = () => {
  // State
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.ape.puzzleCompleted
  );
  const feedback = useGameStore((state) => state.puzzleState.ape.feedback);
  const status = useGameStore((state) => state.puzzleState.ape.status);
  const word = useGameStore((state) => state.puzzleState.ape.word);
  const [userInput, setUserInput] = useState("");

  // Handlers
  const handleLeave = (leaveType: "early" | "default") => {
    const state = useGameStore.getState();
    const puzzleCompleted = state.puzzleState.ape.puzzleCompleted;
    useGameStore.setState({
      showDialog: false,
      currentPuzzle: null,
      puzzleState: {
        ...state.puzzleState,
        ape: {
          ...state.puzzleState.ape,
          status: "instructions",
          word: INITIAL_WORD,
          feedback: apeFeedback.instructions,
        },
      },
      storyLine: [
        ...state.storyLine,
        {
          type: "action",
          text: puzzleCompleted
            ? apeFeedback.storyLineSuccess
            : apeFeedback.storyLineFailure[leaveType],
          isEncrypted: state.encryptionActive,
        },
      ],
      itemLocation: {
        ...state.itemLocation,
        ladder: puzzleCompleted ? "store" : state.itemLocation.ladder,
      },
    });
  };

  const handleReset = () => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        ape: apeReducer(state.puzzleState.ape, { type: "reset" }),
      },
    }));
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      useGameStore.setState((state) => ({
        puzzleState: {
          ...state.puzzleState,
          ape: apeReducer(state.puzzleState.ape, {
            type: "input",
            userInput,
          }),
        },
      }));
      setUserInput("");
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleShowDemo = () => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        ape: apeReducer(state.puzzleState.ape, {
          type: "showDemo",
        }),
      },
    }));
  };

  // Render
  return (
    <PuzzleContainer>
      <PuzzleHeader
        title="Ape Puzzle"
        description="Turn the ape into an owl."
      />
      <PuzzleFeedback feedback={feedback.slice(-20)} height="50vh" />
      {status === "instructions" && (
        <InstructionChoices
          onConfirm={handleShowDemo}
          onCancel={() => {
            handleLeave("early");
          }}
        />
      )}
      {status === "play" && (
        <PuzzleActions
          puzzleCompleted={puzzleCompleted}
          handleReset={handleReset}
          handleLeave={() => {
            handleLeave("default");
          }}
        >
          <TextField
            disabled={puzzleCompleted}
            autoFocus
            label={word}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            value={userInput}
          />
        </PuzzleActions>
      )}
    </PuzzleContainer>
  );
};

interface InstructionChoicesProps {
  onConfirm: () => void;
  onCancel: () => void;
}
const InstructionChoices = ({
  onConfirm,
  onCancel,
}: InstructionChoicesProps) => {
  return (
    <Stack
      direction={"row"}
      sx={{ m: 2, width: "60%", justifyContent: "space-around" }}
    >
      <Button size="large" onClick={onConfirm}>
        Yes please!
      </Button>
      <Button size="large" onClick={onCancel}>
        No thanks!
      </Button>
    </Stack>
  );
};
