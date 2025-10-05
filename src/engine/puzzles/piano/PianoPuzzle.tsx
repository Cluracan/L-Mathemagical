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
  void (audio.cloneNode(true) as HTMLAudioElement).play();
};

//Main Component
export const PianoPuzzle = () => {
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
    Object.values(audioCache).forEach((audio) => {
      if (audio instanceof HTMLAudioElement) {
        audio.preload = "auto";
        audio.load();
      }
    });
  }, []);

  const handleReset = () => {
    useGameStore.setState((state) => ({
      ...state,
      puzzleState: {
        ...state.puzzleState,
        piano: pianoReducer(state.puzzleState.piano, {
          type: "reset",
        }),
      },
    }));
  };

  const handleLeave = () => {
    useGameStore.setState((state) => ({
      ...state,
      showDialog: false,
      currentPuzzle: null,
      puzzleState: { ...state.puzzleState, piano: initialPianoState },
      storyLine: [
        ...state.storyLine,
        state.puzzleState.piano.puzzleCompleted
          ? pianoFeedback.storyLineSuccess
          : pianoFeedback.storyLineFailure,
      ],
      itemLocation: {
        ...state.itemLocation,
        ...(state.puzzleState.piano.puzzleCompleted && {
          bottle: "music",
          phial: "music",
        }),
      },
    }));
  };

  const handleNotePress = (note: NoteId) => {
    if (puzzleCompleted || playedNotes.length >= TARGET_MELODY.length) return;
    playAudioNote(note);
    useGameStore.setState((state) => ({
      ...state,
      puzzleState: {
        ...state.puzzleState,
        piano: pianoReducer(state.puzzleState.piano, {
          type: "play",
          note,
        }),
      },
    }));
  };

  const handleCheck = () => {
    if (playedNotes.length >= TARGET_MELODY.length) return;
    useGameStore.setState((state) => ({
      ...state,
      puzzleState: {
        ...state.puzzleState,
        piano: pianoReducer(state.puzzleState.piano, {
          type: "check",
        }),
      },
    }));
  };

  return (
    <PuzzleContainer>
      <PuzzleHeader title="Piano Puzzle" description="Play the right tune." />
      <NotesDisplay playedNotes={playedNotes} />
      <PianoKeyboard onNotePress={handleNotePress} />
      <PuzzleFeedback height="24vh" feedback={feedback.slice(-20)} />
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
