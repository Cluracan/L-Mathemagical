import {
  getNextClueMessage,
  getRandomFailureMessage,
  pianoFeedback,
  pianoKeys,
  TARGET_MELODY,
  type NoteId,
  type NoteName,
  type PianoState,
} from "./pianoConstants";

//Types
type PianoAction = { type: "play"; note: NoteId } | { type: "reset" };

//Helper Functions
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

//Main Function
export function pianoReducer(state: PianoState, action: PianoAction) {
  switch (action.type) {
    case "play":
      let nextPlayedNotes = [...state.playedNotes];
      let nextFeedback = [...state.feedback];
      let nextPuzzleCompleted = state.puzzleCompleted;
      //max notes played
      if (nextPlayedNotes.length >= TARGET_MELODY.length) return state;
      //else add and play note
      nextPlayedNotes.push(action.note);

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
