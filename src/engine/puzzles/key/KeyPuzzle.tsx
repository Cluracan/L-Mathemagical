import { Box, Button, Snackbar, Stack, styled, useTheme } from "@mui/material";
import { memo, useCallback } from "react";
import { useGameStore } from "../../../store/useGameStore";
import { produce } from "immer";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";

//types
export type KeyState = {
  selectedCells: boolean[];
  puzzleCompleted: boolean;
  feedback: string;
  showFeedback: boolean;
};

//Keyholes data
const lockDisplayCols = 21;
const lockDisplayRows = 10;
const lockPatternCells = new Set([
  "0x0",
  "0x1",
  "0x6",
  "0x7",
  "0x8",
  "0x12",
  "0x13",
  "0x14",
  "0x18",
  "0x19",
  "1x1",
  "1x2",
  "1x7",
  "1x12",
  "1x13",
  "1x18",
  "1x19",
  "1x20",
  "2x0",
  "2x1",
  "2x6",
  "2x7",
  "2x8",
  "2x13",
  "2x14",
  "2x19",
  "3x0",
  "3x1",
  "3x2",
  "3x6",
  "3x7",
  "3x12",
  "3x13",
  "3x14",
  "3x18",
  "3x19",
  "3x20",
  "4x0",
  "4x1",
  "4x2",
  "4x6",
  "4x7",
  "4x12",
  "4x18",
  "4x19",
  "4x20",
  "5x0",
  "5x1",
  "5x6",
  "5x7",
  "5x8",
  "5x12",
  "5x13",
  "5x18",
  "5x19",
  "5x20",
  "6x1",
  "6x2",
  "6x7",
  "6x8",
  "6x12",
  "6x13",
  "6x19",
  "7x0",
  "7x1",
  "7x2",
  "7x6",
  "7x7",
  "7x8",
  "7x13",
  "7x14",
  "7x18",
  "7x19",
  "7x20",
  "8x1",
  "8x2",
  "8x7",
  "8x12",
  "8x13",
  "8x14",
  "8x18",
  "8x19",
  "8x20",
  "9x1",
  "9x7",
  "9x13",
  "9x19",
]);

const lockDisplayData: string[] = [];
for (let i = 0; i < lockDisplayRows; i++) {
  for (let j = 0; j < lockDisplayCols; j++) {
    lockDisplayData.push(lockPatternCells.has(`${i}x${j}`) ? "black" : "white");
  }
}

//Key blank data
const INITIAL_SELECTED_CELLS = [9, 29];
const keyBlankCols = 10;
const keyBlankRows = 3;
const keyBlankSolution = [
  0, 1, 2, 3, 4, 5, 6, 8, 9, 14, 21, 22, 26, 27, 28, 29,
];

const keyFeedback = {
  default:
    "Click on a cell to use the file. You can test, reset, or leave at any time.",
  doesNotFit: "The key will not fit into all the locks.",
  willNotTurn:
    "The key fits into all the keyholes but will not turn all the locks.",
  success: "You\'ve done it! The key can now be used to open the oak door!. ",
  storyLineSuccess: "You look proudly at the key you have made.",
  storyLineFailure:
    "You stare at the file and key blanks, wondering if you should try again.",
};

export const initialKeyState: KeyState = {
  selectedCells: Array.from({ length: keyBlankCols * keyBlankRows }, (_, i) =>
    INITIAL_SELECTED_CELLS.includes(i)
  ),
  puzzleCompleted: false,
  feedback: keyFeedback.default,
  showFeedback: true,
};

export const KeyPuzzle = () => {
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.key.puzzleCompleted
  );
  const feedback = useGameStore((state) => state.puzzleState.key.feedback);
  const showFeedback = useGameStore(
    (state) => state.puzzleState.key.showFeedback
  );

  const handleReset = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.key.selectedCells = initialKeyState.selectedCells;
      })
    );
  };

  const handleLeave = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.showDialog = false;
        draft.currentPuzzle = null;
        if (state.puzzleState.key.puzzleCompleted) {
          draft.itemLocation.iron = "player";
          draft.storyLine.push(keyFeedback.storyLineSuccess);
        } else {
          draft.storyLine.push(keyFeedback.storyLineFailure);
          draft.puzzleState.key.selectedCells = initialKeyState.selectedCells;
        }
      })
    );
  };

  const handleTestKey = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        const selectedCells = draft.puzzleState.key.selectedCells;
        if (keyBlankSolution.every((cellIndex) => selectedCells[cellIndex])) {
          const selectedCellsCount = selectedCells.filter(
            (cell) => cell === true
          ).length;
          if (selectedCellsCount === keyBlankSolution.length) {
            draft.puzzleState.key.puzzleCompleted = true;
            draft.puzzleState.key.feedback = keyFeedback.success;
          } else {
            draft.puzzleState.key.feedback = keyFeedback.willNotTurn;
          }
        } else {
          draft.puzzleState.key.feedback = keyFeedback.doesNotFit;
        }
        draft.puzzleState.key.showFeedback = true;
      })
    );
  };
  const closeFeedback = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.key.showFeedback = false;
      })
    );
  };
  return (
    <PuzzleContainer>
      <PuzzleHeader
        title="Key Puzzle"
        description="File the key blank to make a key that will fit all locks"
      />

      <LockDisplay />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${keyBlankCols},1fr)`,
        }}
      >
        {Array.from({ length: keyBlankCols * keyBlankRows }, (_, i) => (
          <KeyCell key={i} index={i} />
        ))}
      </Box>

      <Snackbar
        open={showFeedback}
        onClose={closeFeedback}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message={feedback}
      />
      <PuzzleActions
        handleReset={handleReset}
        handleLeave={handleLeave}
        puzzleCompleted={puzzleCompleted}
      >
        <Button variant="contained" size="large" onClick={handleTestKey}>
          Test key
        </Button>
      </PuzzleActions>
    </PuzzleContainer>
  );
};

const LockDisplay = memo(() => {
  const theme = useTheme();
  return (
    <>
      <Stack direction="row" p={2} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            color: theme.palette.secondary.main,
            mr: 8,
            width: theme.spacing(8),
          }}
        >
          Four key holes
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${lockDisplayCols},1fr)`,
            p: 2,
            mr: 8,
            backgroundColor: "white",
          }}
        >
          {lockDisplayData.map((color, index) => (
            <div
              key={index}
              style={{
                height: theme.spacing(3),
                width: theme.spacing(3),
                backgroundColor: color,
              }}
            ></div>
          ))}
        </Box>
      </Stack>
    </>
  );
});

const KeyCell = memo(({ index }: { index: number }) => {
  const cellSelected = useGameStore(
    (state) => state.puzzleState.key.selectedCells[index]
  );
  const handleClick = useCallback(() => {
    if (useGameStore.getState().puzzleState.key.puzzleCompleted) return;
    useGameStore.setState((state) => {
      if (state.puzzleState.key.selectedCells[index]) return state;
      const newSelectedCells = [...state.puzzleState.key.selectedCells];
      newSelectedCells[index] = true;
      return {
        ...state,
        puzzleState: {
          ...state.puzzleState,
          key: { ...state.puzzleState.key, selectedCells: newSelectedCells },
        },
      };
    });
  }, [index]);

  return (
    <StyledCell
      key={index}
      onClick={handleClick}
      className={cellSelected ? "filled" : "empty"}
    />
  );
});

// https://mui.com/system/styled/
const StyledCell = styled("div")(({ theme }) => ({
  width: theme.spacing(3),
  height: theme.spacing(3),
  border: "1px solid #ccc",
  cursor: "pointer",
  "&.filled": {
    backgroundColor: "transparent",
  },
  "&.empty": {
    backgroundColor: "yellow",
  },
  "&:hover": {
    border: "1px dashed black",
  },
}));
