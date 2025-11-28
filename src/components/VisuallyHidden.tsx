import { Box, type BoxProps } from "@mui/material";
import type { PropsWithChildren } from "react";

// This allows you to pass Box props like aria, role, scx overides
type VisuallyHiddenProps = PropsWithChildren<BoxProps>;

export const VisuallyHidden = ({ children }: VisuallyHiddenProps) => {
  return (
    <Box
      sx={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0 0 0 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {children}
    </Box>
  );
};
