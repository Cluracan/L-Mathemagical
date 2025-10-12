import { produce } from "immer";
import type { PipelineFunction } from "../../pipeline/types";

// Types
export interface AbbotState {
  dialogIndex: number;
  puzzleCompleted: boolean;
}

// Narrative Content
const dialog = [
  "The abbot says he would like to find Runia but he is an old man and needs your help. She is somewhere in the palace. He warns you that there are many dangers, such as the Drogo Robot Guards, who are impossible to defeat unless you can find the personal secret number which each guard cannot bear to hear. You will come up against many weird and puzzling situations before you can find Runia.\n\nThe abbot asks you again if you will help.",
  "A strange sound behind you attracts your attention. When you turn back the abbot has vanished",
];
const abbotFeedback = {
  confused: 'The abbot looks confused. "Shall I go on?"',
  description:
    'The abbot is wearing a long, flowing robe. He looks at you quizically - "Shall I continue?"',
};

// Initial State
export const initialAbbotState: AbbotState = {
  dialogIndex: 0,
  puzzleCompleted: false,
};

export const handleAbbotPuzzle: PipelineFunction = (payload) => {
  const { command, target } = payload;

  switch (command) {
    case "say": {
      return produce(payload, (draft) => {
        const { abbot } = draft.gameState.puzzleState;
        const { storyLine } = draft.gameState;
        if (target && ["y", "yes"].includes(target)) {
          storyLine.push(dialog[abbot.dialogIndex]);
          abbot.dialogIndex += 1;
          if (abbot.dialogIndex === dialog.length) {
            abbot.puzzleCompleted = true;
          }
        } else if (target && ["n", "no"].includes(target)) {
          storyLine.push(dialog[dialog.length - 1]);
          abbot.puzzleCompleted = true;
          draft.gameState.currentPuzzle = null;
        } else {
          storyLine.push(abbotFeedback.confused);
        }
        draft.done = true;
      });
    }
    case "move": {
      return produce(payload, (draft) => {
        draft.gameState.puzzleState.abbot.puzzleCompleted = true;
        draft.gameState.currentPuzzle = null;
        draft.gameState.storyLine.push(dialog[dialog.length - 1]);
      });
    }

    case "look": {
      if (target === "abbot") {
        return produce(payload, (draft) => {
          draft.gameState.storyLine.push(abbotFeedback.description);
          draft.done = true;
        });
      }
      break;
    }
    default:
      return payload;
  }
  return payload;
};
