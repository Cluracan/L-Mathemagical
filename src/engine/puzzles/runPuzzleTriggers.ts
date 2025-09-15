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
  const { puzzleCompleted, currentRoom, currentPuzzle } = gameState;

  //not in a puzzle room
  if (!isPuzzleLocation(currentRoom)) return payload;

  // Puzzle in progress
  if (
    currentPuzzle &&
    !puzzleCompleted[currentPuzzle] &&
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
    acceptPuzzleText,
    rejectPuzzleText,
    feedback,
    examinableItems,
  } = puzzleNPC;

  //puzzleHandler above (turtle) needed option of unique response to 'look' (ie null target)
  if (!target) return payload;

  switch (puzzleCompleted[puzzleId]) {
    case true:
      if (
        command === triggerPuzzleCommand &&
        acceptPuzzleText.includes(target)
      ) {
        return stopWithSuccess(payload, feedback.puzzleIsComplete);
      }
      if (
        command === "look" &&
        examinableItems[target] &&
        examinableItems[target].puzzleComplete
      ) {
        return stopWithSuccess(payload, examinableItems[target].puzzleComplete);
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
      if (
        command === "look" &&
        examinableItems[target] &&
        examinableItems[target].puzzleIncomplete !== null
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
