import { Stack, useTheme, type StackProps } from "@mui/material";

export const PuzzleContainer = ({ children, ...props }: StackProps) => {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        height: "80vh",
        alignItems: "center",
        justifyContent: "space-between",
        p: theme.spacing(2),
      }}
      {...props}
    >
      {children}
    </Stack>
  );
};
