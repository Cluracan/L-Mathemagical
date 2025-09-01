import { produce } from "immer";
import { failCommand } from "../pipeline/failCommand";
import { stopWithSuccess } from "../pipeline/stopWithSuccess";
import type { PipelineFunction } from "../pipeline/types";
import { isPuzzleLocation, puzzleRegistry } from "./puzzleRegistry";

export const runPuzzleTriggers: PipelineFunction = (payload) => {
  const { gameState, command, target } = payload;
  const { puzzleCompleted, currentRoom, currentPuzzle, showDialog } = gameState;
  console.log(gameState);
  //not in a puzzle room
  if (!isPuzzleLocation(currentRoom) || !target) return payload;

  // Puzzle in progress
  if (
    currentPuzzle &&
    !puzzleCompleted[currentPuzzle] &&
    puzzleRegistry[currentRoom].puzzleId === currentPuzzle &&
    !showDialog &&
    puzzleRegistry[currentRoom].pipelineFunction
  ) {
    console.log("puzzle in progess");
    return puzzleRegistry[currentRoom].pipelineFunction(payload);
  }

  const { puzzleId, puzzleNPC } = puzzleRegistry[currentRoom];
  const {
    usesDialog,
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
        const nextGameState = produce(gameState, (draft) => {
          draft.currentPuzzle = puzzleId;
          draft.showDialog = usesDialog;
          draft.storyLine.push(feedback.puzzleAccept);
        });
        return { ...payload, gameState: nextGameState, done: true };
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
