import { Dialog } from "@mui/material";
import {
  puzzleRegistry,
  type PuzzleId,
} from "../../engine/puzzles/puzzleRegistry";

type PuzzleDialogProps = {
  puzzleId: PuzzleId;
  showDialog: boolean;
};

export const PuzzleDialog = (props: PuzzleDialogProps) => {
  const { puzzleId, showDialog } = props;
  if (!showDialog || !puzzleId || puzzleRegistry[puzzleId].component === null)
    return null;

  const puzzleComponent = puzzleRegistry[puzzleId].component;

  return (
    <>
      <Dialog open={showDialog} fullWidth={true} maxWidth={"lg"}>
        {puzzleComponent()}
      </Dialog>
    </>
  );
};
