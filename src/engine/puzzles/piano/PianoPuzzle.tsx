import { Button, Stack, useTheme } from "@mui/material";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";
import {
  audioCache,
  getNextClueMessage,
  getRandomFailureMessage,
  initialPianoState,
  pianoFeedback,
  pianoKeys,
  TARGET_MELODY,
  type NoteId,
  type NoteName,
  type PianoState,
} from "./pianoConstants";
import { produce } from "immer";
import { useCallback } from "react";
import { NotesDisplay } from "./NotesDisplay";

export const PianoPuzzle = () => {
  const feedback = useGameStore((state) => state.puzzleState.piano.feedback);
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.piano.puzzleCompleted
  );
  const playedNotes = useGameStore(
    (state) => state.puzzleState.piano.playedNotes
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
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.showDialog = false;
        draft.currentPuzzle = null;
        if (draft.puzzleState.piano.puzzleCompleted) {
          draft.itemLocation.bottle = "music";
          draft.itemLocation.phial = "music";
          draft.storyLine.push(pianoFeedback.storyLineSuccess);
        } else {
          draft.puzzleState.piano = initialPianoState;
          draft.storyLine.push(pianoFeedback.storyLineFailure);
        }
      })
    );
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
      <NotesDisplay playedNotes={playedNotes} />
      <PianoKeyboard onNotePress={handleNotePress} />
      <PuzzleFeedback height="24vh" feedback={feedback} />
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
      let nextFeedback = [...state.feedback];
      let nextPuzzleCompleted = state.puzzleCompleted;
      //max notes played
      if (nextPlayedNotes.length >= TARGET_MELODY.length) return state;
      //else add and play note
      nextPlayedNotes.push(action.note);
      playAudioNote(action.note);
      //successCheck if max notes
      if (nextPlayedNotes.length >= TARGET_MELODY.length) {
        if (winCheck(nextPlayedNotes)) {
          nextFeedback.push(...pianoFeedback.success);
          nextPuzzleCompleted = true;
        } else if (allTheRightNotes(nextPlayedNotes)) {
          nextFeedback.push(pianoFeedback.morecombeQuote);
        } else {
          nextFeedback.push(getRandomFailureMessage());
          nextFeedback.push(getNextClueMessage());
        }
      }
      return {
        ...state,
        playedNotes: nextPlayedNotes,
        feedback: nextFeedback,
        puzzleCompleted: nextPuzzleCompleted,
      };
    case "reset":
      return {
        ...state,
        playedNotes: [],
        feedback: [...state.feedback, ...pianoFeedback.default],
      };
  }
}

const winCheck = (playedNotes: NoteId[]) => {
  return TARGET_MELODY.every(
    (note, index) => pianoKeys[playedNotes[index]].noteName === note
  );
};

// Morecombe and Wise Easter Egg https://www.youtube.com/watch?v=uMPEUcVyJsc
const allTheRightNotes = (playedNotes: NoteId[]) => {
  const noteCount = (targetNote: NoteName) => {
    return playedNotes.filter((note) => pianoKeys[note].noteName === targetNote)
      .length;
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
