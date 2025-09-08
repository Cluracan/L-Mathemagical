import {
  Box,
  Button,
  Card,
  DialogContent,
  DialogTitle,
  Stack,
  styled,
} from "@mui/material";
import { memo, useCallback } from "react";
import { useGameStore } from "../../../store/useGameStore";
import tree from "../../../assets/images/tree.svg";

const ORCHARD_SIZE = 25;
const ORCHARD_WIDTH = 5;
const TREE_COUNT = 9;
export const initialTreeSelectedCells = Array.from(
  { length: ORCHARD_SIZE },
  () => false
);

const curTreeCount = (selectedCells: boolean[]) => {
  return selectedCells.filter((cell) => cell === true).length;
};

export const TreePuzzle = () => {
  const puzzleCompleted = useGameStore((state) => state.puzzleCompleted.tree);
  const handleReset = () => {};
  const handleLeave = () => {};
  const handleTreeCheck = () => {};
  return (
    <>
      <Stack sx={{ alignItems: "center", width: "100%" }}>
        <DialogTitle>Tree Puzzle</DialogTitle>
        <DialogContent>Place the trees in 10 lines of 3</DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${ORCHARD_WIDTH},1fr)`,
            backgroundColor: "rgb(87, 125, 61)",
            gap: "1px",
            width: "30%",
          }}
        >
          {Array.from({ length: ORCHARD_SIZE }, (_, i) => i).map((i) => (
            <TreeCell key={i} index={i} />
          ))}
        </Box>
        <Card
          sx={{
            width: "50%",
            height: "3rem",
            lineHeight: "3rem",
            textAlign: "center",
            margin: "2rem auto",
          }}
        >
          Feedback in here
        </Card>
        <Stack
          direction="row"
          width={"100%"}
          padding={"2rem"}
          sx={{ justifyContent: "space-around" }}
        >
          <Button disabled={puzzleCompleted} onClick={handleReset}>
            Reset
          </Button>
          <Button variant="contained" size="large" onClick={handleTreeCheck}>
            Check Trees
          </Button>
          <Button onClick={handleLeave}>Leave</Button>
        </Stack>
      </Stack>
    </>
  );
};

const TreeCell = memo(({ index }: { index: number }) => {
  const cellSelected = useGameStore(
    (state) => state.puzzleState.tree.selectedCells[index]
  );

  const handleClick = useCallback(() => {
    if (useGameStore.getState().puzzleCompleted.tree) return;
    useGameStore.setState((state) => {
      const newSelectedCells = useGameStore
        .getState()
        .puzzleState.tree.selectedCells.slice();

      //all trees planted
      if (
        !useGameStore.getState().puzzleState.tree.selectedCells[index] &&
        curTreeCount(newSelectedCells) === TREE_COUNT
      )
        return state;

      newSelectedCells[index] = !newSelectedCells[index];
      return {
        ...state,
        puzzleState: {
          ...state.puzzleState,
          tree: { selectedCells: newSelectedCells },
        },
      };
    });
  }, [index]);
  return (
    <StyledCell key={index} onClick={handleClick}>
      {cellSelected && (
        <img
          src={tree}
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
  width: "100%",
  aspectRatio: "1 / 1",
  backgroundColor: "rgb(116, 188, 67)",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&:hover": {
    border: "2px dotted rgb(32,120,9)",
  },
});
