import { produce } from "immer";
import { createKeyGuard } from "../../../utils/guards";
import type { PipelineFunction } from "../../pipeline/types";

//Types
export interface TurtleState {
  displacement: { x: number; y: number };
  puzzleCompleted: boolean;
}

//Initial State
export const initialTurtleState: TurtleState = {
  displacement: { x: 6, y: 4 },
  puzzleCompleted: false,
};

//Constants
const turtleMovement = {
  n: { dx: 0, dy: 1, direction: "north" },
  e: { dx: 1, dy: 0, direction: "east" },
  s: { dx: 0, dy: -1, direction: "south" },
  w: { dx: -1, dy: 0, direction: "west" },
} as const;
const willMoveTurtle = createKeyGuard(turtleMovement);

export const handleTurtlePuzzle: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  const displacementFromPlayer = gameState.puzzleState.turtle.displacement;

  //Leave puzzle
  if (command === "move" && target === "d") {
    return produce(payload, (draft) => {
      draft.gameState.currentPuzzle = null;
      draft.gameState.storyLine.push(
        'As you leave the courtyard, the turtle wanders back to his starting slab. "Please come back when you are ready!" he calls.'
      );
      draft.gameState.puzzleState.turtle = initialTurtleState;
    });
  }

  //In Puzzle Commands
  if (command === "move" && target && willMoveTurtle(target)) {
    const [nextX, nextY] = [
      displacementFromPlayer.x + turtleMovement[target].dx,
      displacementFromPlayer.y + turtleMovement[target].dy,
    ];
    const moveDirection = turtleMovement[target].direction;

    return produce(payload, (draft) => {
      draft.gameState.storyLine.push(
        `As you move one square to the ${moveDirection}, the turtle moves two squares to the ${moveDirection}.`
      );
      draft.gameState.puzzleState.turtle.displacement = { x: nextX, y: nextY };
      draft.gameState.success = false;
      draft.gameState.feedback = "move";
      draft.done = true;

      //win check
      if (nextX === 0 && nextY === 0) {
        draft.gameState.storyLine.push(
          "The turtle sidles up to meet you. He gives you a small rusty key which he was concealing in his shell. Then he scurries back to the centre of the courtyard and shuts his eyes."
        );
        draft.gameState.puzzleState.turtle.puzzleCompleted = true;
        draft.gameState.itemLocation.rusty = "player";
      }
    });
  }

  if (command === "look" && (target === null || target === "turtle")) {
    const turtleLocation = gameState.puzzleState.turtle.displacement;
    const xDistance = Math.abs(turtleLocation.x);
    const yDistance = Math.abs(turtleLocation.y);
    const xDirection = turtleLocation.x >= 0 ? "east" : "west";
    const yDirection = turtleLocation.y >= 0 ? "north" : "south";

    return produce(payload, (draft) => {
      draft.gameState.storyLine.push(
        `The turtle is ${String(yDistance)} squares to the ${yDirection} of you, and ${String(xDistance)} squares to the ${xDirection} of you.`
      );
      draft.done = true;
    });
  }
  return payload;
};
