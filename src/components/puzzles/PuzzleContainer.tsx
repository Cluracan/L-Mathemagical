import { Stack, useTheme, type StackProps } from "@mui/material";

export const PuzzleContainer = ({ children, ...props }: StackProps) => {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        // width: "100%",
        height: "80vh",
        alignItems: "center",
        p: theme.spacing(2),
        // overflow: "hidden",
      }}
      {...props}
    >
      {children}
    </Stack>
  );
};
