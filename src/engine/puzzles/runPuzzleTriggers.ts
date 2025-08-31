import { failCommand } from "../pipeline/failCommand";
import { stopWithSuccess } from "../pipeline/stopWithSuccess";
import type { PipelineFunction } from "../pipeline/types";
import { isPuzzleLocation, puzzleRegistry } from "./puzzleRegistry";

export const runPuzzleTriggers: PipelineFunction = (payload) => {
  const { gameState, command, target } = payload;
  const { puzzleCompleted, currentRoom } = gameState;
  if (!isPuzzleLocation(currentRoom) || !target) return payload;
  const { puzzleId, puzzleNPC } = puzzleRegistry[currentRoom];
  const {
    triggerPuzzleCommand,
    acceptPuzzleText,
    rejectPuzzleText,
    feedback,
    examinableItems,
  } = puzzleNPC;
  switch (puzzleCompleted[puzzleId]) {
    case true:
      if (
        command === triggerPuzzleCommand &&
        acceptPuzzleText.includes(target) &&
        feedback.failPuzzleAccept
      ) {
        return stopWithSuccess(payload, feedback.failPuzzleAccept);
      }
      break;
    case false:
      //start puzzle
      if (
        command === triggerPuzzleCommand &&
        acceptPuzzleText.includes(target)
      ) {
        console.log("start puzzle");
        return stopWithSuccess(payload, feedback.puzzleAccept);
      }
      //reject puzzle
      if (
        command === triggerPuzzleCommand &&
        rejectPuzzleText.includes(target)
      ) {
        return stopWithSuccess(payload, feedback.puzzleReject);
      }
      //examine clues
      if (command === "look" && Object.keys(examinableItems).includes(target)) {
        return stopWithSuccess(payload, examinableItems[target]);
      }
      //move check
      if (command === "move" && feedback.blockedExits) {
        return failCommand(payload, feedback.blockedExits);
      }
      break;
  }
  return payload;
};
