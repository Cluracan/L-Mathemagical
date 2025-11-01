import { Button, Stack } from "@mui/material";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";
import {
  directionText,
  initialSpiderState,
  spiderFeedback,
  type Direction,
} from "./spiderConstants";
import { spiderReducer } from "./spiderReducer";

// Types
interface InstructionChoicesProps {
  onConfirm: () => void;
  onCancel: () => void;
}

interface InputButtonsProps {
  onClick: (direction: Direction) => void;
}

export const SpiderPuzzle = () => {
  // State
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.spider.puzzleCompleted
  );
  const feedback = useGameStore((state) => state.puzzleState.spider.feedback);
  const status = useGameStore((state) => state.puzzleState.spider.status);

  // Handlers
  const handleReset = () => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        spider: spiderReducer(state.puzzleState.spider, {
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
        spider: {
          ...initialSpiderState,
          puzzleCompleted: state.puzzleState.spider.puzzleCompleted,
        },
      },
      storyLine: [
        ...state.storyLine,
        {
          type: "description",
          text: state.puzzleState.spider.puzzleCompleted
            ? spiderFeedback.storyLineSuccess
            : spiderFeedback.storyLineFailure,
          isEncrypted: state.encryptionActive,
        },
      ],
      itemLocation: {
        ...state.itemLocation,
        ...(state.puzzleState.spider.puzzleCompleted && { ring: "spider" }),
      },
    }));
  };

  const handleInput = (direction: Direction) => {
    useGameStore.setState((state) => ({
      puzzleState: {
        ...state.puzzleState,
        spider: spiderReducer(state.puzzleState.spider, {
          type: "input",
          direction,
        }),
      },
    }));
  };

  // Render
  return (
    <PuzzleContainer>
      <PuzzleHeader
        title="Spider Puzzle"
        description="Guide the spider along the edges of the room."
      />
      <PuzzleFeedback feedback={feedback.slice(-20)} height="52vh" />
      {status === "instructions" && (
        <InstructionChoices onCancel={handleLeave} onConfirm={handleReset} />
      )}
      {status !== "instructions" && (
        <PuzzleActions
          handleReset={handleReset}
          handleLeave={handleLeave}
          puzzleCompleted={puzzleCompleted}
        >
          <InputButtons onClick={handleInput} />
        </PuzzleActions>
      )}
    </PuzzleContainer>
  );
};

const InstructionChoices = ({
  onConfirm,
  onCancel,
}: InstructionChoicesProps) => {
  return (
    <Stack
      direction={"row"}
      sx={{ width: "60%", margin: 2, justifyContent: "space-around" }}
    >
      <Button variant="contained" onClick={onCancel}>
        Leave
      </Button>
      <Button variant="contained" onClick={onConfirm}>
        Start
      </Button>
    </Stack>
  );
};

const InputButtons = ({ onClick }: InputButtonsProps) => {
  const status = useGameStore((state) => state.puzzleState.spider.status);
  console.log("render");
  return (
    <>
      {Object.entries(directionText).map(([direction, text]) => (
        <Button
          key={direction}
          variant="contained"
          size="large"
          onClick={() => {
            onClick(direction as Direction);
          }}
          disabled={status === "failedAttempt"}
        >
          {text}
        </Button>
      ))}
    </>
  );
};
