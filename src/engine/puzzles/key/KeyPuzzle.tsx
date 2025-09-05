import {
  Box,
  Card,
  CardActionArea,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useGameStore } from "../../../store/useGameStore";
import { produce } from "immer";

const fourKeyCols = 21;
const fourKeyRows = 10;
const fourKeyFiledCells = [
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
];
const fourKeyData = Array.from({ length: fourKeyRows }, (_, i) =>
  Array.from({ length: fourKeyCols }, (_, j) =>
    fourKeyFiledCells.includes(`${i}x${j}`) ? "black" : "white"
  )
);

export const initialKeyBlankSelectedCells = [9, 29];
const keyBlankCols = 10;
const keyBlankRows = 3;
const keyBlankSolution = [
  0, 1, 2, 3, 4, 5, 6, 8, 9, 14, 21, 22, 26, 27, 28, 29,
];

export const initialKeyBlankData = Array.from(
  { length: keyBlankCols * keyBlankRows },
  (_, i) => [9, 29].includes(i)
);

console.log(initialKeyBlankData);
export const KeyPuzzle = () => {
  const { puzzleState } = useGameStore();
  const { keyBlankData } = puzzleState.key;

  console.log("render key puzzle");

  const handleClick = (cell: number) => {
    console.log(cell);
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.key.keyBlankData[cell] = true;
      })
    );
  };

  return (
    <>
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <DialogTitle>Key Puzzle</DialogTitle>
        <DialogContentText>
          File the key blank to make a key that will fit all locks
        </DialogContentText>
        <FourKeyMap />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${keyBlankCols},1fr)`,
            backgroundColor: "white",
          }}
        >
          {keyBlankData.map((selected, i) => {
            return (
              <Card
                sx={{
                  borderRadius: 0,
                }}
                key={`keyBlank${i}`}
              >
                <CardActionArea
                  sx={{
                    height: "1.5rem",
                    width: "1.5rem",
                    borderRadius: 0,
                    backgroundColor: selected ? "#393939" : "yellow",
                    ":hover": {
                      border: 1,
                      borderColor: "black",
                      borderStyle: "dashed",
                    },
                  }}
                  onClick={() => handleClick(i)}
                ></CardActionArea>
              </Card>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

const FourKeyMap = () => {
  console.log("draw fourKeys");
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ color: "green", margin: "4rem", width: "4rem" }}>
          Four key holes
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${fourKeyCols},1fr)`,
            padding: "1rem 2rem",
            marginRight: "4rem",
            backgroundColor: "white",
          }}
        >
          {fourKeyData.map((rowData, i) => {
            console.log("render");
            return rowData.map((cell, j) => (
              <Box
                key={`${i}x${j}`}
                sx={{
                  height: "1.5rem",
                  width: "1.5rem",
                  backgroundColor: cell,
                }}
              ></Box>
            ));
          })}
        </Box>
      </Box>
    </>
  );
};
