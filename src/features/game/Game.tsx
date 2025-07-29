import { Box, Card, TextField } from "@mui/material";
import { useGameStore } from "../../store/useGameStore";
import { useState, type ChangeEvent } from "react";
import { handleInput } from "../../engine/gameEngine";

export const GameContent = () => {
  console.log("rendering Game page");
  const { storyLine } = useGameStore();
  const [userInput, setUserInput] = useState("");
  const handleSubmit = (): void => {
    console.log("submitting");
    handleInput(userInput);
    setUserInput("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    //can now tranlate this when in spectacle mode
    setUserInput(e.target.value);
  };
  return (
    <>
      <Box height={"80vh"} width={"80vw"}>
        <Card>
          {storyLine.map((entry, index) => {
            return <pre key={index}>{entry}</pre>;
          })}
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
