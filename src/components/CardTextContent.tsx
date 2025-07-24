import { Typography } from "@mui/material";

interface CardTextContentProps {
  text: string[];
}

export const CardTextContent = ({ text }: CardTextContentProps) => {
  return (
    <>
      {text.map((line, index) => (
        <Typography key={index} variant="body1" sx={{ marginBottom: "1rem" }}>
          {line}
        </Typography>
      ))}
    </>
  );
};
