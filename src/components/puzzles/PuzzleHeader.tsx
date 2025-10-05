import { DialogContentText, DialogTitle } from "@mui/material";

interface PuzzleHeaderProps {
  title: string;
  description: string;
}

export const PuzzleHeader = ({ title, description }: PuzzleHeaderProps) => {
  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContentText>{description}</DialogContentText>
    </>
  );
};
