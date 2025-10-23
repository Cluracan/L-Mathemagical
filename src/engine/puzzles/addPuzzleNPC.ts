import type { GameState } from "../gameEngine";
import { isPuzzleLocation, puzzleAtLocation } from "./puzzleRegistry";

interface PuzzleNPCDescriptionArgs {
  visitedRooms: GameState["visitedRooms"];
  currentRoom: GameState["currentRoom"];
  puzzleState: GameState["puzzleState"];
  currentPuzzle: GameState["currentPuzzle"];
}

export const getPuzzleNPCDescription = (args: PuzzleNPCDescriptionArgs) => {
  const { visitedRooms, currentRoom, puzzleState, currentPuzzle } = args;
  if (!isPuzzleLocation(currentRoom)) return null;

  const { puzzleId, puzzleNPC } = puzzleAtLocation[currentRoom];
  if (currentPuzzle === puzzleId) {
    return puzzleNPC.description.inProgress;
  } else {
    return puzzleState[puzzleId].puzzleCompleted
      ? puzzleNPC.description.completed
      : visitedRooms.has(currentRoom)
        ? puzzleNPC.description.short
        : puzzleNPC.description.long;
  }
};
