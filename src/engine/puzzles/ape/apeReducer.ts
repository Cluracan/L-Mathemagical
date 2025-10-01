//Types
import { produce } from "immer";
import { apeFeedback, type ApeState } from "./apeConstants";
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

type ApeAction = { type: "input"; userInput: string };
export function apeReducer(state: ApeState, action: ApeAction) {
  switch (action.type) {
    case "input":
      const userInput = action.userInput.toLowerCase();
      const currentWord = state.word;

      if (userInput.length !== 3) {
        return produce(state, (draft) => {
          draft.feedback.push(userInput, apeFeedback.userInput.wrongLength);
        });
      } else if (!isValidConnection(userInput, currentWord)) {
        return produce(state, (draft) => {
          draft.feedback.push(userInput, apeFeedback.userInput.doesNotConnect);
          draft.word = "ape";
        });
      } else if (!threeLetterWords.has(userInput)) {
        return produce(state, (draft) => {
          draft.feedback.push(userInput, apeFeedback.userInput.isNotWord);
        });
      } else if (userInput === "owl") {
        return produce(state, (draft) => {
          draft.feedback.push(userInput, apeFeedback.userInput.success);
          draft.word = userInput;
          draft.puzzleCompleted = true;
        });
      } else {
        return produce(state, (draft) => {
          draft.feedback.push(userInput, apeFeedback.userInput.validWord);
          draft.word = userInput;
        });
      }
  }
  return state;
}
