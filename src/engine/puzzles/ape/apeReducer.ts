//Types
import { produce } from "immer";
import {
  APE_INIITAL_WORD,
  APE_TARGET_WORD,
  apeFeedback,
  type ApeState,
} from "./apeConstants";
import { threeLetterWords } from "./threeLetterWords";

//Helper Functions
const isValidConnection = (userInput: string, currentWord: string) => {
  let changedLetterCount = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] !== currentWord[i]) {
      changedLetterCount++;
    }
  }
  return changedLetterCount <= 1;
};

type ApeAction =
  | { type: "input"; userInput: string }
  | { type: "showDemo" }
  | { type: "reset" };
export function apeReducer(state: ApeState, action: ApeAction) {
  switch (action.type) {
    case "input":
      const userInput = action.userInput.toLowerCase();
      const currentWord = state.word;
      let nextFeedback = [...state.feedback, userInput];
      let nextPuzzleCompleted = state.puzzleCompleted;
      let nextWord = currentWord;
      if (userInput.length !== APE_TARGET_WORD.length) {
        nextFeedback.push(apeFeedback.userInput.wrongLength);
      } else if (!isValidConnection(userInput, currentWord)) {
        nextFeedback.push(apeFeedback.userInput.doesNotConnect);
      } else if (!threeLetterWords.has(userInput)) {
        nextFeedback.push(apeFeedback.userInput.isNotWord);
      } else if (userInput === APE_TARGET_WORD) {
        nextFeedback.push(apeFeedback.userInput.success);
        nextPuzzleCompleted = true;
        nextWord = userInput;
      } else {
        nextFeedback.push(apeFeedback.userInput.validWord);
        nextWord = userInput;
      }
      return {
        ...state,
        puzzleCompleted: nextPuzzleCompleted,
        feedback: nextFeedback,
        word: nextWord,
      };
    case "showDemo":
      return produce(state, (draft) => {
        draft.feedback.push(...apeFeedback.demo);
        draft.status = "play";
      });
    case "reset":
      return {
        ...state,
        word: APE_INIITAL_WORD,
        feedback: [...state.feedback, apeFeedback.reset, ...apeFeedback.demo],
      };
  }
  return state;
}
