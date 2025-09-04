import { Box, Card, Dialog, TextField } from "@mui/material";
import { useGameStore } from "../../store/useGameStore";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Canvas } from "./Canvas";
import { useGameController } from "../../middleware/useGameController";
import { LightsPuzzle } from "../../engine/puzzles/lights/LightsPuzzle";

export const GameContent = () => {
  const { storyLine, modernMode, showDialog } = useGameStore();
  const [userInput, setUserInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { submitInput, reportAnimationComplete } = useGameController();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storyLine]);

  const handleSubmit = (): void => {
    submitInput(userInput);
    setUserInput("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    //can now tranlate this when in spectacle mode
    setUserInput(e.target.value);
  };

  return (
    <>
      {modernMode && (
        <Canvas reportAnimationComplete={reportAnimationComplete} />
      )}

      <Box height={"80vh"} width={"60vw"} sx={{ marginLeft: "2rem" }}>
        <Card
          sx={{
            height: 1,
            padding: "1rem",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          {storyLine.map((entry, index) => {
            return (
              <Box key={index} sx={{ marginBottom: "1.5rem" }}>
                {entry}
              </Box>
            );
          })}
          <div ref={bottomRef} />
        </Card>
        <TextField
          fullWidth
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          value={userInput}
        ></TextField>
      </Box>
      {modernMode && showDialog && (
        <Dialog open={showDialog} fullWidth={true} maxWidth={"lg"}>
          <LightsPuzzle visible={true} />
        </Dialog>
      )}
    </>
  );
};
