import { Button, Stack } from "@mui/material";
import type { PropsWithChildren } from "react";

type PuzzleActionProps = {
  puzzleCompleted: boolean;
  handleReset: () => void;
  handleLeave: () => void;
};

export const PuzzleActions = ({
  puzzleCompleted,
  handleReset,
  handleLeave,
  children,
}: PropsWithChildren<PuzzleActionProps>) => {
  return (
    <Stack
      direction="row"
      sx={{ justifyContent: "space-around", width: "100%", padding: 3 }}
    >
      <Button disabled={puzzleCompleted} onClick={handleReset}>
        Reset
      </Button>
      {children}
      <Button
        onClick={handleLeave}
        color={puzzleCompleted ? "success" : "primary"}
      >
        Leave
      </Button>
    </Stack>
  );
};
