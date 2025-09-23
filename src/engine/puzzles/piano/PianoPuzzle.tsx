import { produce } from "immer";
import { useCallback } from "react";
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

//Helper functions
const playAudioNote = (note: NoteId) => {
  const audio = audioCache[note];
  if (!audio) return;
  (audio.cloneNode(true) as HTMLAudioElement).play();
};

//Main Component
export const PianoPuzzle = () => {
  const feedback = useGameStore((state) => state.puzzleState.piano.feedback);
  const puzzleCompleted = useGameStore(
    (state) => state.puzzleState.piano.puzzleCompleted
  );
  const playedNotes = useGameStore(
    (state) => state.puzzleState.piano.playedNotes
  );
  console.log(`Render PianoPuzzle playedNotes length ${playedNotes.length}`);
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
      console.log(playedNotes);
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
