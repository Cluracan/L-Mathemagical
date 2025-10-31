import { produce } from "immer";
import type { PipelineFunction } from "../../pipeline/types";

// Types
export interface AbbotState {
  dialogIndex: number;
  puzzleCompleted: boolean;
}

// Narrative Content
const dialog = [
  'The abbot places a hand on your shoulder, voice steady but urgent.\n\n“The palace is guarded by Drogo Guards: unbeatable, unless you can discover the number each one cannot bear to hear. Only those clever enough to discover the secret numbers will be able to pass safely."\n\n"Will you enter the palace and retrieve the amulet for me?”',
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
          storyLine.push({
            type: "description",
            text: dialog[abbot.dialogIndex],
            isEncrypted: draft.gameState.encryptionActive,
          });
          abbot.dialogIndex += 1;
          if (abbot.dialogIndex === dialog.length) {
            abbot.puzzleCompleted = true;
          }
        } else if (target && ["n", "no"].includes(target)) {
          storyLine.push({
            type: "description",
            text: dialog[dialog.length - 1],
            isEncrypted: draft.gameState.encryptionActive,
          });
          abbot.puzzleCompleted = true;
          draft.gameState.currentPuzzle = null;
        } else {
          storyLine.push({
            type: "description",
            text: abbotFeedback.confused,
            isEncrypted: draft.gameState.encryptionActive,
          });
        }
        draft.done = true;
      });
    }
    case "move": {
      return produce(payload, (draft) => {
        draft.gameState.puzzleState.abbot.puzzleCompleted = true;
        draft.gameState.currentPuzzle = null;
        draft.gameState.storyLine.push({
          type: "description",
          text: dialog[dialog.length - 1],
          isEncrypted: draft.gameState.encryptionActive,
        });
      });
    }

    case "look": {
      if (target === "abbot") {
        return produce(payload, (draft) => {
          draft.gameState.storyLine.push({
            type: "description",
            text: abbotFeedback.description,
            isEncrypted: draft.gameState.encryptionActive,
          });
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
