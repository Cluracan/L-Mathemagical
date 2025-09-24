import { produce } from "immer";
import { PuzzleActions } from "../../../components/puzzles/PuzzleActions";
import { PuzzleContainer } from "../../../components/puzzles/PuzzleContainer";
import { PuzzleFeedback } from "../../../components/puzzles/PuzzleFeedback";
import { PuzzleHeader } from "../../../components/puzzles/PuzzleHeader";
import { useGameStore } from "../../../store/useGameStore";
import {
  audioCache,
  initialPianoState,
  pianoFeedback,
  TARGET_MELODY,
  type NoteId,
} from "./pianoConstants";
import { NotesDisplay } from "./NotesDisplay";
import { PianoKeyboard } from "./PianoKeyboard";
import { pianoReducer } from "./pianoReducer";
import { Button } from "@mui/material";
import { useEffect } from "react";

//Helper functions
const playAudioNote = (note: NoteId) => {
  const audio = audioCache[note];
  if (!audio) return;
  (audio.cloneNode(true) as HTMLAudioElement).play();
};

//Main Component
export const PianoPuzzle = () => {
  console.log("main puzzle render");
  const attempts = useGameStore((state) => state.puzzleState.piano.attempts);
  const feedback = useGameStore((state) => state.puzzleState.piano.feedback);
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.piano.puzzleCompleted
  );
  const playedNotes = useGameStore(
    (state) => state.puzzleState.piano.playedNotes
  );

  //Preload Audio
  useEffect(() => {
    console.log("preload");
    Object.entries(audioCache).forEach(([_, audio]) => {
      if (audio instanceof HTMLAudioElement) {
        audio.preload = "auto";
        audio.load();
      }
    });
  });

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

  const handleNotePress = (note: NoteId) => {
    if (puzzleCompleted || playedNotes.length >= TARGET_MELODY.length) return;
    playAudioNote(note);
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.piano = pianoReducer(draft.puzzleState.piano, {
          type: "play",
          note,
        });
      })
    );
  };

  const handleCheck = () => {
    if (playedNotes.length >= TARGET_MELODY.length) return;
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.puzzleState.piano = pianoReducer(draft.puzzleState.piano, {
          type: "check",
        });
      })
    );
  };

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
      >
        {attempts > pianoFeedback.clueMessages.length && (
          <Button
            disabled={puzzleCompleted}
            variant="contained"
            size="large"
            onClick={handleCheck}
          >
            Check
          </Button>
        )}
      </PuzzleActions>
    </PuzzleContainer>
  );
};
