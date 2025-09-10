import { DialogContentText, DialogTitle } from "@mui/material";

type PuzzleHeaderProps = {
  title: string;
  description: string;
};

export const PuzzleHeader = ({ title, description }: PuzzleHeaderProps) => {
  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContentText>{description}</DialogContentText>
    </>
  );
};
