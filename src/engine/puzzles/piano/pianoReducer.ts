import { produce } from "immer";
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

// Types
type PianoAction =
  | { type: "play"; note: NoteId }
  | { type: "reset" }
  | { type: "check" };

// Helpers
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

// Reducer
export function pianoReducer(state: PianoState, action: PianoAction) {
  switch (action.type) {
    case "play": {
      //max notes played
      if (state.playedNotes.length >= TARGET_MELODY.length) {
        return state;
      }
      //else add and play note
      return produce(state, (draft) => {
        draft.playedNotes.push(action.note);
        //successCheck if max notes
        if (draft.playedNotes.length >= TARGET_MELODY.length) {
          draft.attempts++;
          const sequentialMatchCount = countSequentialMatches(
            draft.playedNotes
          );
          if (sequentialMatchCount === TARGET_MELODY.length) {
            draft.feedback.push(...pianoFeedback.success);
            draft.puzzleCompleted = true;
          } else if (containsAllRightNotes(draft.playedNotes)) {
            draft.feedback.push(pianoFeedback.morecombeQuote);
          } else {
            draft.feedback.push(getRandomFailureMessage());
            if (draft.attempts <= pianoFeedback.clueMessages.length) {
              draft.feedback.push(getNextClueMessage());
            } else {
              draft.feedback.push(
                getSequentialMatchCountMessage(sequentialMatchCount)
              );
            }
          }
        }
      });
    }
    case "reset": {
      return produce(state, (draft) => {
        draft.playedNotes = [];
        draft.feedback.push(...pianoFeedback.default);
      });
    }
    case "check": {
      return produce(state, (draft) => {
        const sequentialMatchCount = countSequentialMatches(draft.playedNotes);
        if (sequentialMatchCount === draft.playedNotes.length) {
          draft.feedback.push(pianoFeedback.partialSuccess);
        } else if (containsAllRightNotes(draft.playedNotes)) {
          draft.feedback.push(pianoFeedback.morecombeQuote);
        } else {
          draft.feedback.push(
            getSequentialMatchCountMessage(sequentialMatchCount)
          );
        }
      });
    }
    default:
      return state;
  }
}
