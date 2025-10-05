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
  initialTreeState,
  ORCHARD_SIZE,
  ORCHARD_WIDTH,
  TREE_COUNT,
  treeFeedback,
} from "./treeConstants";

//Helper Functions
const countTrees = (selectedCells: boolean[]) => {
  let count = 0;
  for (let i = 0; i < selectedCells.length; i++) {
    if (selectedCells[i]) count++;
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
          draft.storyLine.push(...treeFeedback.storyLineSuccess);
        } else {
          draft.storyLine.push(...treeFeedback.storyLineFailure);
          draft.puzzleState.tree.selectedCells = initialTreeState.selectedCells;
          draft.puzzleState.tree.feedback = initialTreeState.feedback;
        }
      })
    );
  };

  const handleTreeCheck = () => {
    const selectedCells =
      useGameStore.getState().puzzleState.tree.selectedCells;
    const treeCount = countTrees(selectedCells);
    const lineCount = countLines(selectedCells);
    const nextFeedback = [" ", "You ask the gardener to check the trees..."];
    if (lineCount === 10) {
      nextFeedback.push(...treeFeedback.success);
      useGameStore.setState((state) =>
        produce(state, (draft) => {
          draft.puzzleState.tree.feedback.push(...nextFeedback);
          draft.puzzleState.tree.puzzleCompleted = true;
          draft.itemLocation.oar = "player";
        })
      );
    } else {
      if (lineCount === 0) {
        nextFeedback.push(
          'The gardener looks puzzled. "I can\'t see any lines of trees yet!"'
        );
      } else if (treeCount < 9) {
        nextFeedback.push(
          `The gardener looks at you. "I can only see ${String(lineCount)} ${
            lineCount === 1 ? "line" : "lines"
          } of trees, but then you've only used ${String(treeCount)} ${
            treeCount === 1 ? "tree" : "trees"
          } so far...`
        );
      } else {
        nextFeedback.push(
          `"Hmm." says the gardener. "You've used all the trees, but I can only see ${String(lineCount)} ${
            lineCount === 1 ? "line" : "lines"
          } so far...maybe you could rearrange them?"`
        );
      }
      useGameStore.setState((state) =>
        produce(state, (draft) => {
          draft.puzzleState.tree.feedback.push(...nextFeedback);
        })
      );
    }
  };

  return (
    <>
      <PuzzleContainer>
        <PuzzleHeader
          title="Tree Puzzle"
          description="Place the trees in ten lines of three"
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${String(ORCHARD_WIDTH)},1fr)`,
            gap: "1px",
            width: "50vh",
            margin: 1,
            backgroundColor: "rgb(87, 125, 61)",
          }}
        >
          {Array.from({ length: ORCHARD_SIZE }, (_, i) => i).map((i) => (
            <TreeCell key={i} index={i} />
          ))}
        </Box>
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
    <StyledCell key={index} onClick={handleClick}>
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
