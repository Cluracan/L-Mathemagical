import { Help } from "@mui/icons-material";
import { Box, IconButton, Popover } from "@mui/material";
import { useState, type MouseEvent, type ReactNode } from "react";

interface PuzzleHelpProps {
  children: ReactNode;
}

export const PuzzleHelp = ({ children }: PuzzleHelpProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = "help-content";

  return (
    <div>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        sx={{
          position: "absolute",
          right: 16,
          top: 16,
        }}
      >
        <Help />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2 }}>{children}</Box>
      </Popover>
    </div>
  );
};
