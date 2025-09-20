import { Button, Stack, useTheme } from "@mui/material";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";
import {
  audioCache,
  pianoKeys,
  TARGET_MELODY,
  type NoteId,
} from "./pianoConstants";
import { produce } from "immer";
import { useCallback } from "react";

export const PianoPuzzle = () => {
  const feedback = useGameStore((state) => state.puzzleState.piano.feedback);
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.piano.puzzleCompleted
  );
  const handleReset = () => {
    console.log("reset");
  };

  const handleLeave = () => {
    console.log("leave");
  };

  const handleNotePress = useCallback(
    (note: NoteId) => {
      if (puzzleCompleted) return;
      useGameStore.setState((state) =>
        produce(state, (draft) => {
          let nextPlayedNotes = [...draft.puzzleState.piano.playedNotes];
          //max notes played
          if (nextPlayedNotes.length >= TARGET_MELODY.length) return draft;
          console.log(
            `Played ${note} nextplayedNoteslength ${nextPlayedNotes.length}`
          );
          nextPlayedNotes.push(pianoKeys[note].noteName);
          playAudioNote(note);
          draft.puzzleState.piano.playedNotes = nextPlayedNotes;
        })
      );
    },
    [puzzleCompleted]
  );

  return (
    <PuzzleContainer>
      <PuzzleHeader title="Piano Puzzle" description="Play the right tune." />

      <PianoKeyboard onNotePress={handleNotePress} />
      <PuzzleFeedback height="20vh" feedback={feedback} />
      <PuzzleActions
        handleReset={handleReset}
        handleLeave={handleLeave}
        puzzleCompleted={puzzleCompleted}
      ></PuzzleActions>
    </PuzzleContainer>
  );
};

type PianoKeyboardProps = { onNotePress: (note: NoteId) => void };

const PianoKeyboard = ({ onNotePress }: PianoKeyboardProps) => {
  const theme = useTheme();
  return (
    <>
      <Stack
        direction={"row"}
        sx={{
          width: "60%",
          justifyContent: "center",
          gap: 1,
          backgroundColor: "gray",
        }}
      >
        {(Object.keys(pianoKeys) as NoteId[]).map((noteId) => {
          const keyColor = pianoKeys[noteId].color;
          return (
            <Button
              key={noteId}
              onClick={() => onNotePress(noteId)}
              sx={{
                height:
                  keyColor === "white" ? theme.spacing(24) : theme.spacing(18),
                width:
                  keyColor === "white" ? theme.spacing(8) : theme.spacing(2),
                backgroundColor: keyColor,
                zIndex: keyColor === "white" ? 1 : 2,
                ml:
                  keyColor === "black" ? -4 : pianoKeys[noteId].offset ? -5 : 0,

                alignItems: "end",
              }}
            >
              {pianoKeys[noteId].display}
            </Button>
          );
        })}
      </Stack>
    </>
  );
};

const playAudioNote = (note: NoteId) => {
  const audio = audioCache[note];
  if (!audio) return;
  (audio.cloneNode(true) as HTMLAudioElement).play();
};
