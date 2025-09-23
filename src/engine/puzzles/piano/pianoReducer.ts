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
type PianoAction =
  | { type: "play"; note: NoteId }
  | { type: "reset" }
  | { type: "check" };

//Helper Functions
const winCheck = (playedNotes: NoteId[]) => {
  return playedNotes.every(
    (note, index) => TARGET_MELODY[index] === pianoKeys[note].noteName
  );
};

// Morecombe and Wise Easter Egg https://www.youtube.com/watch?v=uMPEUcVyJsc
const allTheRightNotes = (playedNotes: NoteId[]) => {
  const melodySlice = TARGET_MELODY.slice(0, playedNotes.length);
  const noteCount = (targetNote: NoteName, noteArray: NoteName[]) => {
    return noteArray.filter((note) => note === targetNote).length;
  };
  //not optimised (could memoise or skip notes that have been counted)
  return playedNotes.every((noteId) => {
    const targetNote = pianoKeys[noteId].noteName;
    return (
      noteCount(
        targetNote,
        playedNotes.map((note) => pianoKeys[note].noteName)
      ) === noteCount(targetNote, melodySlice)
    );
  });
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
    case "check":
      if (winCheck(state.playedNotes)) {
        return {
          ...state,
          feedback: [...state.feedback, pianoFeedback.partialSuccess],
        };
      } else if (allTheRightNotes(state.playedNotes)) {
        return {
          ...state,
          feedback: [...state.feedback, pianoFeedback.morecombeQuote],
        };
      } else {
        return {
          ...state,
          feedback: [...state.feedback, pianoFeedback.partialFailure],
        };
      }
  }
}
