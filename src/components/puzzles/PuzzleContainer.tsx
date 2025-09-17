import { Stack, type StackProps } from "@mui/material";

export const PuzzleContainer = ({ children, ...props }: StackProps) => {
  return (
    <Stack
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "60vh",
        padding: 2,
      }}
      {...props}
    >
      {children}
    </Stack>
  );
};
