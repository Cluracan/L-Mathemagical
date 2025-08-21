import { Box, Card, TextField } from "@mui/material";
import { useGameStore } from "../../store/useGameStore";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { handleInput } from "../../engine/gameEngine";
import { Canvas } from "./Canvas";
import type { Mapper } from "./mapper";

export const GameContent = () => {
  console.log("rendering Game page");
  const { storyLine, modernMode } = useGameStore();
  const [userInput, setUserInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputQueueRef = useRef<string[]>([]);
  const mapperRef = useRef<Mapper | null>(null);
  const readyForCommandRef = useRef<boolean>(true);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storyLine]);

  const handleSubmit = (): void => {
    if (modernMode) {
      console.log("submitting");
      setUserInput("");
      inputQueueRef.current.push(userInput);
      processInputQueue();
    } else {
      setUserInput("");
      handleInput(userInput);
    }
  };

  const processInputQueue = () => {
    while (readyForCommandRef.current && inputQueueRef.current.length > 0) {
      console.log(
        `processing Input queue  ${inputQueueRef.current.join(",")} ready ${readyForCommandRef.current} input ${inputQueueRef.current.length}`
      );
      const userInput = inputQueueRef.current.shift();
      if (userInput) {
        readyForCommandRef.current = false;
        const result = handleInput(userInput);
        if (result.command !== "move") {
          readyForCommandRef.current = true;
        }
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    //can now tranlate this when in spectacle mode
    setUserInput(e.target.value);
  };

  return (
    <>
      <p>{modernMode ? "Modern Mode" : "Classic Mode"}</p>
      {modernMode && (
        <Canvas
          mapperRef={mapperRef}
          readyForCommandRef={readyForCommandRef}
          processInputQueue={processInputQueue}
        />
      )}
      <Box height={"80vh"} width={"60vw"}>
        <Card sx={{ height: 1, overflowY: "auto", whiteSpace: "pre-wrap" }}>
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
    </>
  );
};
