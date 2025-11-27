import { Card, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

interface PuzzleFeedbackProps {
  feedback: string[];
  height: string;
}

export const PuzzleFeedback = ({ feedback, height }: PuzzleFeedbackProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [feedback]);

  return (
    <Card
      sx={{
        width: "80%",
        height,
        padding: { md: 1, lg: 2 },
        overflowY: "auto",
        whiteSpace: "pre-wrap",
      }}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {feedback.map((entry, index) => (
        <Typography key={index} sx={{ mb: 1 }}>
          {entry}
        </Typography>
      ))}
      <div ref={bottomRef} />
    </Card>
  );
};
