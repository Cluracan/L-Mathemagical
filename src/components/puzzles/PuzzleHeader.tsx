import { DialogContentText, DialogTitle } from "@mui/material";

interface PuzzleHeaderProps {
  title: string;
  description: string;
}

export const PuzzleHeader = ({ title, description }: PuzzleHeaderProps) => {
  return (
    <>
      <DialogTitle sx={{ p: { sm: 0, lg: 2 } }}>{title}</DialogTitle>
      <DialogContentText>{description}</DialogContentText>
    </>
  );
};
