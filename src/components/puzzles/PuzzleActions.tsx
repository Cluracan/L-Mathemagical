import { Button, Stack } from "@mui/material";
import type { PropsWithChildren } from "react";

type PuzzleActions = {
  puzzleCompleted: boolean;
  handleReset: () => void;
  handleLeave: () => void;
};

export const PuzzleActions = ({
  puzzleCompleted,
  handleReset,
  handleLeave,
  children,
}: PropsWithChildren<PuzzleActions>) => {
  return (
    <Stack
      direction="row"
      width={"100%"}
      padding={"2rem"}
      sx={{ justifyContent: "space-around" }}
    >
      <Button disabled={puzzleCompleted} onClick={handleReset}>
        Reset
      </Button>
      {children}
      <Button onClick={handleLeave}>Leave</Button>
    </Stack>
  );
};
