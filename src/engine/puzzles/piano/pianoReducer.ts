import {
  getNextClueMessage,
  getRandomFailureMessage,
  getSequentialMatchCountMessage,
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
const countSequentialMatches = (playedNotes: NoteId[]) => {
  for (let i = 0; i < playedNotes.length; i++) {
    if (pianoKeys[playedNotes[i]].noteName !== TARGET_MELODY[i]) {
      return i;
    }
  }
  return playedNotes.length;
};

// Morecombe and Wise Easter Egg https://www.youtube.com/watch?v=uMPEUcVyJsc
const containsAllRightNotes = (playedNotes: NoteId[]) => {
  const melodySlice = TARGET_MELODY.slice(0, playedNotes.length);
  const getNoteCounts = (notes: NoteName[]) => {
    return notes.reduce(
      (counts, note) => {
        counts[note] = (counts[note] || 0) + 1;
        return counts;
      },
      {} as Record<NoteName, number>
    );
  };
  const targetCounts = getNoteCounts(melodySlice);
  const playedCounts = getNoteCounts(
    playedNotes.map((note) => pianoKeys[note].noteName)
  );
  return Object.entries(targetCounts).every(
    ([note, count]) => playedCounts[note as NoteName] === count
  );
};

//Main Function
export function pianoReducer(state: PianoState, action: PianoAction) {
  switch (action.type) {
    case "play":
      let nextPlayedNotes = [...state.playedNotes];
      let nextFeedback = [...state.feedback];
      let nextPuzzleCompleted = state.puzzleCompleted;
      let nextAttempts = state.attempts;

      //max notes played
      if (nextPlayedNotes.length >= TARGET_MELODY.length) return state;
      //else add and play note
      nextPlayedNotes.push(action.note);

      //successCheck if max notes
      if (nextPlayedNotes.length >= TARGET_MELODY.length) {
        nextAttempts++;
        const sequentialMatchCount = countSequentialMatches(nextPlayedNotes);
        if (sequentialMatchCount === TARGET_MELODY.length) {
          nextFeedback.push(...pianoFeedback.success);
          nextPuzzleCompleted = true;
        } else if (containsAllRightNotes(nextPlayedNotes)) {
          nextFeedback.push(pianoFeedback.morecombeQuote);
        } else {
          nextFeedback.push(getRandomFailureMessage());
          if (nextAttempts <= pianoFeedback.clueMessages.length) {
            nextFeedback.push(getNextClueMessage());
          } else {
            nextFeedback.push(
              getSequentialMatchCountMessage(sequentialMatchCount)
            );
          }
        }
      }
      return {
        ...state,
        playedNotes: nextPlayedNotes,
        attempts: nextAttempts,
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
      const sequentialMatchCount = countSequentialMatches(state.playedNotes);
      if (sequentialMatchCount === state.playedNotes.length) {
        return {
          ...state,
          feedback: [...state.feedback, pianoFeedback.partialSuccess],
        };
      } else if (containsAllRightNotes(state.playedNotes)) {
        return {
          ...state,
          feedback: [...state.feedback, pianoFeedback.morecombeQuote],
        };
      } else {
        return {
          ...state,
          feedback: [
            ...state.feedback,
            getSequentialMatchCountMessage(sequentialMatchCount),
          ],
        };
      }
    default:
      return state;
  }
}
