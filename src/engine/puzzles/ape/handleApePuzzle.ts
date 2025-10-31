import { produce } from "immer";
import type { PipelineFunction } from "../../pipeline/types";

// Narrative Content
const apeFeedback = {
  puzzleAccept: "You listen to what the ape has to say.",
  puzzleReject: "The ape climbs a nearby tree and sits on a branch.",
  confused: '"Hmm?" says the ape, "Would you like some help?"',
  examinableItems: {
    ape: 'The ape looks quizically at you. "Would you like some help?"',
    tree: "The tree is an apple tree, although it has neither apples nor apes in it at present.",
  },
};

export const handleApePuzzle: PipelineFunction = (payload) => {
  const { command, target } = payload;

  switch (command) {
    case "say": {
      return produce(payload, (draft) => {
        const { storyLine } = draft.gameState;
        if (target && ["y", "yes"].includes(target)) {
          draft.gameState.showDialog = true;
          draft.gameState.currentPuzzle = "ape";
          storyLine.push({
            type: "description",
            text: apeFeedback.puzzleAccept,
            isEncrypted: draft.gameState.encryptionActive,
          });
        } else if (target && ["n", "no"].includes(target)) {
          draft.gameState.currentPuzzle = null;
          storyLine.push({
            type: "description",
            text: apeFeedback.puzzleReject,
            isEncrypted: draft.gameState.encryptionActive,
          });
        } else {
          storyLine.push({
            type: "description",
            text: apeFeedback.confused,
            isEncrypted: draft.gameState.encryptionActive,
          });
        }
        draft.done = true;
      });
    }
    case "look": {
      return produce(payload, (draft) => {
        const { storyLine } = draft.gameState;
        if (target === "ape") {
          storyLine.push({
            type: "description",
            text: apeFeedback.examinableItems.ape,
            isEncrypted: draft.gameState.encryptionActive,
          });
          draft.done = true;
        } else if (target === "tree") {
          storyLine.push({
            type: "description",
            text: apeFeedback.examinableItems.tree,
            isEncrypted: draft.gameState.encryptionActive,
          });
          draft.done = true;
        } else {
          storyLine.push({
            type: "description",
            text: apeFeedback.puzzleReject,
            isEncrypted: draft.gameState.encryptionActive,
          });
          draft.gameState.currentPuzzle = null;
        }
      });
    }
    default: {
      return produce(payload, (draft) => {
        draft.gameState.storyLine.push({
          type: "description",
          text: apeFeedback.puzzleReject,
          isEncrypted: draft.gameState.encryptionActive,
        });
        draft.gameState.currentPuzzle = null;
      });
    }
  }
};
