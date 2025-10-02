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
  return changedLetterCount === 1;
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
      return produce(state, (draft) => {
        draft.feedback.push(userInput);
        if (userInput === currentWord) {
          draft.feedback.push(apeFeedback.userInput.hasNotChanged);
        } else if (userInput.length !== APE_TARGET_WORD.length) {
          draft.feedback.push(apeFeedback.userInput.wrongLength);
        } else if (!isValidConnection(userInput, currentWord)) {
          draft.feedback.push(apeFeedback.userInput.doesNotConnect);
        } else if (!threeLetterWords.has(userInput)) {
          draft.feedback.push(apeFeedback.userInput.isNotWord);
        } else if (userInput === APE_TARGET_WORD) {
          draft.feedback.push(apeFeedback.userInput.success);
          draft.puzzleCompleted = true;
          draft.word = userInput;
        } else {
          draft.feedback.push(apeFeedback.userInput.validWord);
          draft.word = userInput;
        }
      });
    case "showDemo":
      return produce(state, (draft) => {
        draft.feedback.push(...apeFeedback.demo);
        draft.status = "play";
      });
    case "reset":
      return produce(state, (draft) => {
        draft.word = APE_INIITAL_WORD;
        draft.feedback = [apeFeedback.reset, ...apeFeedback.demo];
      });
  }
  return state;
}
