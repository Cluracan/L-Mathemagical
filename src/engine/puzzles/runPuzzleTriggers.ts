import { produce } from "immer";
import { failCommand } from "../pipeline/failCommand";
import { stopWithSuccess } from "../pipeline/stopWithSuccess";
import type { PipelineFunction } from "../pipeline/types";
import {
  isPuzzleLocation,
  puzzleAtLocation,
  puzzleRegistry,
} from "./puzzleRegistry";

export const runPuzzleTriggers: PipelineFunction = (payload) => {
  const { gameState, command, target } = payload;
  const { currentRoom, currentPuzzle, puzzleState } = gameState;
  console.log({ gameState, command, target });
  //not in a puzzle room
  if (!isPuzzleLocation(currentRoom)) return payload;

  // Puzzle in progress
  if (
    currentPuzzle &&
    !puzzleState[currentPuzzle].puzzleCompleted &&
    puzzleAtLocation[currentRoom].puzzleId === currentPuzzle &&
    puzzleRegistry[currentPuzzle].pipelineFunction
  ) {
    return puzzleRegistry[currentPuzzle].pipelineFunction(payload);
  }

  //else get puzzleID & NPC
  const { puzzleId, puzzleNPC } = puzzleAtLocation[currentRoom];

  const {
    usesDialog,
    triggerPuzzleCommand,
    requiredItems,
    acceptPuzzleText,
    rejectPuzzleText,
    feedback,
    examinableItems,
  } = puzzleNPC;

  const { itemLocation } = gameState;

  //puzzleHandler above (turtle) needed option of unique response to 'look' (ie null target)
  if (!target) return payload;

  switch (puzzleState[puzzleId].puzzleCompleted) {
    case true: {
      if (
        command === triggerPuzzleCommand &&
        acceptPuzzleText.includes(target) &&
        requiredItems.every((itemId) => itemLocation[itemId] === "player") &&
        feedback.puzzleIsComplete
      ) {
        return stopWithSuccess(payload, feedback.puzzleIsComplete);
      }
      if (
        command === "look" &&
        Object.keys(examinableItems).includes(target) &&
        examinableItems[target].puzzleComplete
      ) {
        return stopWithSuccess(payload, examinableItems[target].puzzleComplete);
      }
      break;
    }
    case false:
      {
        if (
          command === triggerPuzzleCommand &&
          acceptPuzzleText.includes(target) &&
          requiredItems.every((itemId) => itemLocation[itemId] === "player")
        ) {
          const nextGameState = produce(gameState, (draft) => {
            draft.currentPuzzle = puzzleId;
            draft.showDialog = usesDialog;
            draft.storyLine.push(feedback.puzzleAccept);
          });

          return { ...payload, gameState: nextGameState, done: true };
        }
      }

      //reject puzzle
      if (
        command === triggerPuzzleCommand &&
        rejectPuzzleText.includes(target)
      ) {
        return stopWithSuccess(payload, feedback.puzzleReject);
      }

      //examine clues
      if (
        command === "look" &&
        Object.keys(examinableItems).includes(target) &&
        examinableItems[target].puzzleIncomplete
      ) {
        return stopWithSuccess(
          payload,
          examinableItems[target].puzzleIncomplete
        );
      }

      //move check
      if (command === "move" && feedback.exitsBlocked) {
        return failCommand(payload, feedback.exitsBlocked);
      }
      break;
  }
  return payload;
};
