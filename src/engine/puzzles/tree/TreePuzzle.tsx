import { Box, Button, styled } from "@mui/material";
import { memo, useCallback } from "react";
import { useGameStore } from "../../../store/useGameStore";
import tree from "../../../assets/images/tree.svg";
import { produce } from "immer";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import {
  checkRows,
  getFailureFeedback,
  initialTreeState,
  LINE_COUNT_TARGET,
  ORCHARD_SIZE,
  ORCHARD_WIDTH,
  TREE_COUNT,
  treeFeedback,
} from "./treeConstants";
import { createStoryElements } from "../../utils/createStoryElements";

//Helper Functions
const countTrees = (selectedCells: boolean[]) => {
  let count = 0;
  for (const cell of selectedCells) {
    if (cell) count++;
  }
  return count;
};

const countLines = (selectedCells: boolean[]) => {
  let numberOfLines = 0;
  checkRows.forEach((checkList) => {
    let treeCount = 0;
    checkList.forEach((searchIndex) => {
      if (selectedCells[searchIndex]) {
        treeCount++;
      }
    });
    if (treeCount >= 3) {
      numberOfLines++;
    }
  });
  return numberOfLines;
};

//Main Component
export const TreePuzzle = () => {
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.tree.puzzleCompleted
  );
  const feedback = useGameStore((state) => state.puzzleState.tree.feedback);

  const handleReset = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.tree.feedback.push(...treeFeedback.reset);
        draft.puzzleState.tree.selectedCells = initialTreeState.selectedCells;
      })
    );
  };

  const handleLeave = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.showDialog = false;
        draft.currentPuzzle = null;
        if (puzzleCompleted) {
          draft.storyLine.push(
            ...createStoryElements({
              type: "description",
              text: treeFeedback.storyLineSuccess,
              isEncrypted: draft.encryptionActive,
            })
          );
          draft.itemLocation.ladder = "player";
        } else {
          draft.storyLine.push(
            ...createStoryElements({
              type: "description",
              text: treeFeedback.storyLineFailure,
              isEncrypted: draft.encryptionActive,
            })
          );
          draft.puzzleState.tree.selectedCells = initialTreeState.selectedCells;
          draft.puzzleState.tree.feedback = initialTreeState.feedback;
        }
      })
    );
  };

  const handleTreeCheck = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        const feedback = draft.puzzleState.tree.feedback;
        const selectedCells = draft.puzzleState.tree.selectedCells;
        const treeCount = countTrees(selectedCells);
        const lineCount = countLines(selectedCells);
        feedback.push(...treeFeedback.checkTrees);
        if (lineCount === LINE_COUNT_TARGET) {
          feedback.push(...treeFeedback.success);
          draft.puzzleState.tree.puzzleCompleted = true;
        } else {
          feedback.push(getFailureFeedback(treeCount, lineCount));
        }
      })
    );
  };

  return (
    <>
      <PuzzleContainer>
        <PuzzleHeader
          title="Tree Puzzle"
          description="Place the trees in ten lines of three"
        />
        <TreeGrid />

        <PuzzleFeedback feedback={feedback.slice(-20)} height="15vh" />

        <PuzzleActions
          handleReset={handleReset}
          handleLeave={handleLeave}
          puzzleCompleted={puzzleCompleted}
        >
          <Button variant="contained" size="large" onClick={handleTreeCheck}>
            Check Trees
          </Button>
        </PuzzleActions>
      </PuzzleContainer>
    </>
  );
};

const TreeGrid = memo(() => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${String(ORCHARD_WIDTH)},1fr)`,
        gap: "1px",
        width: "50vh",
        margin: 1,
        backgroundColor: "rgb(87, 125, 61)",
      }}
      aria-label="Orchard - click on a cell to plant a tree"
    >
      {Array.from({ length: ORCHARD_SIZE }, (_, i) => i).map((i) => (
        <TreeCell key={i} index={i} />
      ))}
    </Box>
  );
});
TreeGrid.displayName = "TreeGrid";

const TreeCell = memo(({ index }: { index: number }) => {
  const cellSelected = useGameStore(
    (state) => state.puzzleState.tree.selectedCells[index]
  );

  const handleClick = useCallback(() => {
    if (useGameStore.getState().puzzleState.tree.puzzleCompleted) return;
    useGameStore.setState((state) => {
      const newSelectedCells = [...state.puzzleState.tree.selectedCells];

      //all trees planted
      if (
        !useGameStore.getState().puzzleState.tree.selectedCells[index] &&
        countTrees(newSelectedCells) === TREE_COUNT
      )
        return state;

      newSelectedCells[index] = !newSelectedCells[index];
      return {
        ...state,
        puzzleState: {
          ...state.puzzleState,
          tree: { ...state.puzzleState.tree, selectedCells: newSelectedCells },
        },
      };
    });
  }, [index]);
  return (
    <StyledCell
      key={index}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={cellSelected ? "Remove tree" : "Plant tree"}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      {cellSelected && (
        <img
          src={tree}
          alt="tree"
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
            width: "auto",
            height: "auto",
          }}
        />
      )}
    </StyledCell>
  );
});
TreeCell.displayName = "TreeCell";

const StyledCell = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  aspectRatio: "1 / 1",
  backgroundColor: "rgb(116, 188, 67)",
  cursor: "pointer",
  "&:hover": {
    border: "2px dotted rgb(32,120,9)",
  },
});
