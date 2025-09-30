import { produce } from "immer";
import type { PipelineFunction } from "../../pipeline/types";

export const handleApePuzzle: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;

  switch (command) {
    case "say":
      if (target && ["y", "yes"].includes(target)) {
        //Start ApePuzzle
        return produce(payload, (draft) => {
          draft.gameState.showDialog = true;
          draft.gameState.currentPuzzle = "ape";
          draft.gameState.storyLine.push(
            "You listen to what the ape has to say."
          );
          draft.done = true;
        });
      }
      if (target && ["n", "no"].includes(target)) {
        return produce(payload, (draft) => {
          draft.gameState.currentPuzzle = null;
          draft.gameState.storyLine.push(
            "The ape climbs a nearby tree and sits on a branch."
          );
          draft.done = true;
        });
      }
      break;
    case "look":
      if (target === "ape") {
        return produce(payload, (draft) => {
          draft.gameState.storyLine.push(
            'The ape looks quizically at you. "Would you like some help?"'
          );
          draft.done = true;
        });
      }
      if (target === "tree") {
        return produce(payload, (draft) => {
          draft.gameState.storyLine.push(
            "The tree is an apple tree, although it has neither apples nor apes in it at present."
          );
          draft.done = true;
        });
      }
      break;
    default:
      return produce(payload, (draft) => {
        draft.gameState.currentPuzzle = null;
      });
  }

  return payload;
};
