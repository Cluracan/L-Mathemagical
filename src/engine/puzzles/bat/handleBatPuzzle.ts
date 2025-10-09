import { produce } from "immer";
import type { PipelineFunction } from "../../pipeline/types";

/* --- Notes ---
Triangular numbers are intentionally only tested up to 90:
100+ would require reformatting, but this would also make it too easy to find '91'
*/

// --- Types ---
export interface BatState {
  puzzleCompleted: boolean;
  attempts: number;
}

// --- Constants ---
const triangularNumbers = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78];

const batFeedback = {
  nonInteger:
    '"Don\'t try and be clever!" screeches the bat. "I only like integers!"',
  tooBig: '"That\'s far too big!" screeches the bat.',
  tooSmall: '"That\'s far too small!" screeches the bat.',
  success: '"That\'s OK", says the large bat, smiling a sickly smile.',
  failure: [
    '"That\'s no good," shrieks the large bat',
    "Half a dozen bats swoop down at you viciously, but at a signal from the large bat they withdraw.",
    '"Try again. But be very, very careful," says the large bat.',
  ],
  hint: '"I detest anything that\'s not triangular", shrieks the large bat.',
  notANumber:
    '"That\'s not a number!" shrieks the bat. "Give me a nice number!"',
  noMove:
    "As you start to move, hundreds of bats swarm around it making it impossible for you to go anywhere.",
  reminder:
    '"I\'m waiting for you to give me a nice number!" screeches the bat.',
  description: "The bat looks back at you impatiently.",
};

// --- Helper Functions ---
const generateTriangleText = (userInput: number) => {
  let textHolder = ["The large bat flies over to a wall and writes:-"];
  let currentText = "";
  for (let i = 1; i <= userInput; i++) {
    currentText += `${i}  `;
    if (i < 10) {
      currentText += " ";
    }
    if (triangularNumbers.includes(i)) {
      textHolder.push(currentText);
      currentText = "";
    }
  }
  textHolder.push(currentText);
  return textHolder;
};

// --- Initial State ---
export const initialBatState: BatState = {
  puzzleCompleted: false,
  attempts: 0,
};

// --- Main Function ---
export const handleBatPuzzle: PipelineFunction = (payload) => {
  const { command, target } = payload;

  switch (command) {
    case "say": {
      const value = Number(target);
      if (!isNaN(value)) {
        return produce(payload, (draft) => {
          draft.gameState.puzzleState.bat.attempts++;
          if (!Number.isInteger(value)) {
            draft.gameState.storyLine.push(batFeedback.nonInteger);
          } else if (value > 90) {
            draft.gameState.storyLine.push(batFeedback.tooBig);
          } else if (value < 30) {
            draft.gameState.storyLine.push(batFeedback.tooSmall);
          } else {
            draft.gameState.puzzleState.bat.attempts++;
            if (triangularNumbers.includes(value)) {
              draft.gameState.puzzleState.bat.puzzleCompleted = true;
              draft.gameState.storyLine.push(
                ...generateTriangleText(value),
                batFeedback.success
              );
              draft.gameState.currentPuzzle = null;
            } else {
              if (draft.gameState.puzzleState.bat.attempts % 3 === 0) {
                draft.gameState.storyLine.push(
                  ...generateTriangleText(value),
                  batFeedback.hint
                );
              } else {
                draft.gameState.storyLine.push(...batFeedback.failure);
              }
            }
          }
          draft.done = true;
        });
      } else {
        return produce(payload, (draft) => {
          draft.gameState.storyLine.push(batFeedback.notANumber);
          draft.done = true;
        });
      }
    }
    case "move": {
      return produce(payload, (draft) => {
        draft.gameState.storyLine.push(
          batFeedback.noMove,
          batFeedback.reminder
        );
        draft.done = true;
      });
    }
    case "look": {
      if (target === "bat") {
        return produce(payload, (draft) => {
          draft.gameState.storyLine.push(
            batFeedback.description,
            batFeedback.reminder
          );
          draft.done = true;
        });
      }
      break;
    }
    default: {
      return payload;
    }
  }
  return payload;
};
