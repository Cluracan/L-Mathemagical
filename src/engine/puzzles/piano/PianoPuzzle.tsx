import { Button, Stack } from "@mui/material";
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

  const handleNotePress = (note: NoteId) => {
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        let nextPlayedNotes = [...draft.puzzleState.piano.playedNotes];
        //max notes played
        if (nextPlayedNotes.length >= TARGET_MELODY.length) return draft;
        console.log(`Played ${note}`);
        nextPlayedNotes.push(pianoKeys[note].noteName);
        playAudioNote(note);
      })
    );
  };

  return (
    <PuzzleContainer>
      <PuzzleHeader title="Piano Puzzle" description="Play the right tune." />
      <Stack direction={"row"}>
        {(Object.keys(pianoKeys) as NoteId[]).map((noteId) => {
          return (
            <Button key={noteId} onClick={() => handleNotePress(noteId)}>
              {pianoKeys[noteId].display}
            </Button>
          );
        })}
      </Stack>
      <PuzzleFeedback height="20vh" feedback={feedback} />
      <PuzzleActions
        handleReset={handleReset}
        handleLeave={handleLeave}
        puzzleCompleted={puzzleCompleted}
      ></PuzzleActions>
    </PuzzleContainer>
  );
};

// const PianoKeyboard = () => {};

const playAudioNote = (note: NoteId) => {
  const audio = audioCache[note];
  if (!audio) return;
  (audio.cloneNode(true) as HTMLAudioElement).play();
};
