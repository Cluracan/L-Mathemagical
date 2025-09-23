import { Button, Stack, useTheme } from "@mui/material";
import { pianoKeys, type NoteId } from "./pianoConstants";

type PianoKeyboardProps = { onNotePress: (note: NoteId) => void };

export const PianoKeyboard = ({ onNotePress }: PianoKeyboardProps) => {
  const theme = useTheme();
  return (
    <>
      <Stack
        direction={"row"}
        sx={{
          m: 2,
          width: "60%",
          justifyContent: "center",
          backgroundColor: "gray",
        }}
      >
        {(Object.keys(pianoKeys) as NoteId[]).map((noteId) => {
          const keyColor = pianoKeys[noteId].color;
          const keyOffset = pianoKeys[noteId].offset;
          return (
            <Button
              key={noteId}
              onClick={() => onNotePress(noteId)}
              sx={
                keyColor === "white"
                  ? {
                      height: theme.spacing(24),
                      width: theme.spacing(12),
                      alignItems: "end",
                      backgroundColor: "white",
                      ml: keyOffset ? -4 : 0,
                      border: "1px solid black",
                      color: "darkgray",
                    }
                  : {
                      height: theme.spacing(8),
                      width: theme.spacing(6),
                      alignItems: "end",
                      ml: -4,
                      backgroundColor: "black",
                      zIndex: 10,
                      border: "1px solid grey",
                    }
              }
            >
              {keyColor === "white" && pianoKeys[noteId].display}
            </Button>
          );
        })}
      </Stack>
    </>
  );
};
