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
  type NoteName,
  type PianoState,
} from "./pianoConstants";
import { produce } from "immer";
import { useCallback } from "react";

export const PianoPuzzle = () => {
  const feedback = useGameStore((state) => state.puzzleState.piano.feedback);
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.piano.puzzleCompleted
  );
  const handleReset = () => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.piano = pianoReducer(draft.puzzleState.piano, {
          type: "reset",
        });
      })
    );
  };

  const handleLeave = () => {
    console.log("leave");
  };

  const handleNotePress = useCallback(
    (note: NoteId) => {
      if (puzzleCompleted) return;
      useGameStore.setState((state) =>
        produce(state, (draft) => {
          draft.puzzleState.piano = pianoReducer(draft.puzzleState.piano, {
            type: "play",
            note,
          });
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

const playAudioNote = (note: NoteId) => {
  const audio = audioCache[note];
  if (!audio) return;
  (audio.cloneNode(true) as HTMLAudioElement).play();
};

type PianoAction = { type: "play"; note: NoteId } | { type: "reset" };
function pianoReducer(state: PianoState, action: PianoAction) {
  switch (action.type) {
    case "play":
      let nextPlayedNotes = [...state.playedNotes];
      //max notes played
      if (nextPlayedNotes.length >= TARGET_MELODY.length) return state;
      //else add and play note
      nextPlayedNotes.push(pianoKeys[action.note].noteName);
      playAudioNote(action.note);
      //successCheck if max notes
      if (nextPlayedNotes.length >= TARGET_MELODY.length) {
        if (winCheck(nextPlayedNotes)) {
          console.log("win");
        } else if (allTheRightNotes(nextPlayedNotes)) {
          console.log("Morecombe!");
        } else {
          console.log("fail");
        }
      }
      return { ...state, playedNotes: nextPlayedNotes };
    case "reset":
      return { ...state, playedNotes: [] };
  }
}

const winCheck = (playedNotes: NoteName[]) => {
  return TARGET_MELODY.every((note, index) => playedNotes[index] === note);
};

// Morecombe and Wise Easter Egg https://www.youtube.com/watch?v=uMPEUcVyJsc
const allTheRightNotes = (playedNotes: NoteName[]) => {
  const noteCount = (targetNote: NoteName) => {
    return playedNotes.filter((note) => note === targetNote).length;
  };
  return (
    noteCount("C") === 3 &&
    noteCount("D") === 2 &&
    noteCount("E") === 2 &&
    noteCount("F") === 2 &&
    noteCount("G") === 3 &&
    noteCount("A") === 2
  );
};
