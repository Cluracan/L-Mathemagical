import { Card, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

type PuzzleFeedbackProps = { feedback: string[] };

export const PuzzleFeedback = ({ feedback }: PuzzleFeedbackProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [feedback]);

  return (
    <Card
      sx={{
        width: "80%",
        p: 2,
        flex: 1,
        overflowY: "auto",
        whiteSpace: "pre-wrap",
      }}
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
