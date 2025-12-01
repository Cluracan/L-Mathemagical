import { Box, Button, Snackbar, Stack, styled, useTheme } from "@mui/material";
import { memo, useCallback } from "react";
import { useGameStore } from "../../../store/useGameStore";
import { produce } from "immer";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import {
  initialKeyState,
  KEYBLANK_COLS,
  KEYBLANK_ROWS,
  KEYBLANK_SOLUTION,
  keyFeedback,
  LOCK_DISPLAY_COLS,
  lockDisplayData,
} from "./keyConstants";

// Types
interface KeyCellProps {
  index: number;
  onCellClick: (index: number) => void;
}

export const KeyPuzzle = () => {
  // State
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.key.puzzleCompleted
  );
  const feedback = useGameStore((state) => state.puzzleState.key.feedback);
  const showFeedback = useGameStore(
    (state) => state.puzzleState.key.showFeedback
  );

  // Handlers
  const handleCellClick = useCallback(
    (index: number) => {
      if (puzzleCompleted) return;
      useGameStore.setState((state) =>
        produce(state, (draft) => {
          draft.puzzleState.key.selectedCells[index] = true;
        })
      );
    },
    [puzzleCompleted]
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
          draft.storyLine.push({
            type: "description",
            text: keyFeedback.storyLineSuccess,
            isEncrypted: draft.encryptionActive,
          });
        } else {
          draft.storyLine.push({
            type: "description",
            text: keyFeedback.storyLineFailure,
            isEncrypted: draft.encryptionActive,
          });
          draft.puzzleState.key.selectedCells = initialKeyState.selectedCells;
        }
      })
    );
  };

  const handleTest = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        const selectedCells = draft.puzzleState.key.selectedCells;
        if (KEYBLANK_SOLUTION.every((cellIndex) => selectedCells[cellIndex])) {
          const selectedCellsCount = selectedCells.filter(
            (cell) => cell
          ).length;
          if (selectedCellsCount === KEYBLANK_SOLUTION.length) {
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

  // Render
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
          gridTemplateColumns: `repeat(${String(KEYBLANK_COLS)},1fr)`,
        }}
      >
        {Array.from({ length: KEYBLANK_COLS * KEYBLANK_ROWS }, (_, i) => (
          <KeyCell key={i} index={i} onCellClick={handleCellClick} />
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
        <Button variant="contained" size="large" onClick={handleTest}>
          Test key
        </Button>
      </PuzzleActions>
    </PuzzleContainer>
  );
};

const LockDisplay = memo(() => {
  const theme = useTheme();
  //I'm using div so don't have access to sx={{}}, style requires this workaround (though see styledCell below for alt)
  return (
    <>
      <Stack direction="row" sx={{ alignItems: "center", padding: 2 }}>
        <Box
          sx={{
            width: 8,
            mr: 8,
            color: theme.palette.secondary.main,
          }}
        >
          Four key holes
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${String(LOCK_DISPLAY_COLS)},1fr)`,
            padding: 2,
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
LockDisplay.displayName = "LockDisplay";

const KeyCell = memo(({ index, onCellClick }: KeyCellProps) => {
  const cellSelected = useGameStore(
    (state) => state.puzzleState.key.selectedCells[index]
  );

  const handleClick = useCallback(() => {
    onCellClick(index);
  }, [index, onCellClick]);

  return (
    <StyledCell
      key={index}
      onClick={handleClick}
      className={cellSelected ? "filled" : "empty"}
      role="button"
      tabIndex={0}
      aria-label={cellSelected ? "Blank" : "File here"}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    />
  );
});
KeyCell.displayName = "KeyCell";

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
