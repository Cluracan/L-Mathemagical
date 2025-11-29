import { Dialog } from "@mui/material";
import {
  puzzleRegistry,
  type PuzzleId,
} from "../../engine/puzzles/puzzleRegistry";
import { memo } from "react";

interface PuzzleDialogProps {
  puzzleId: PuzzleId;
  showDialog: boolean;
}

export const PuzzleDialog = memo((props: PuzzleDialogProps) => {
  const { puzzleId, showDialog } = props;
  if (!showDialog || puzzleRegistry[puzzleId].component === null) return null;

  const PuzzleComponent = puzzleRegistry[puzzleId].component;

  return (
    <>
      <Dialog open={showDialog} fullWidth={true} maxWidth={"lg"} sx={{ p: 0 }}>
        <PuzzleComponent />
      </Dialog>
    </>
  );
});
PuzzleDialog.displayName = "PuzzleDialog";
