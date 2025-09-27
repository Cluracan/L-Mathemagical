import {
  directionText,
  GRID_SIZE,
  GRID_WIDTH,
  initialPigState,
  pigFeedback,
  type CompassDirection,
  type PigState,
} from "./pigConstants";

//Types

type PigAction =
  | {
      type: "movement";
      direction: CompassDirection;
    }
  | { type: "reset" };

//Constants
const compassDirections: CompassDirection[] = ["n", "e", "s", "w"];

//Helper functions
const characterCanMove = (curLocation: number, direction: CompassDirection) => {
  switch (direction) {
    case "n":
      return curLocation >= GRID_WIDTH;
    case "s":
      return curLocation < GRID_SIZE - GRID_WIDTH;
    case "e":
      return curLocation % GRID_WIDTH < GRID_WIDTH - 1;
    case "w":
      return curLocation % GRID_WIDTH > 0;
  }
};

const moveCharacter: Record<CompassDirection, (location: number) => number> = {
  n: (location) => location - GRID_WIDTH,
  s: (location) => location + GRID_WIDTH,
  e: (location) => location + 1,
  w: (location) => location - 1,
};

const getManhattan = (pigLocation: number, playerLocation: number) => {
  let horizontalDistance = Math.abs(
    (pigLocation % GRID_WIDTH) - (playerLocation % GRID_WIDTH)
  );
  let verticalDistance = Math.abs(
    Math.floor(pigLocation / GRID_WIDTH) -
      Math.floor(playerLocation / GRID_WIDTH)
  );
  return horizontalDistance + verticalDistance;
};

const movePig = (curPigLocation: number, playerLocation: number) => {
  let maxDistance = 0;
  let moveOptions: number[] = [];
  for (const pigDirection of compassDirections) {
    if (!characterCanMove(curPigLocation, pigDirection)) continue;
    const nextPigLocation = moveCharacter[pigDirection](curPigLocation);
    const nextDistance = getManhattan(nextPigLocation, playerLocation);
    if (nextDistance > maxDistance) {
      moveOptions = [nextPigLocation];
      maxDistance = nextDistance;
    } else if (nextDistance === maxDistance) {
      moveOptions.push(nextPigLocation);
    }
  }

  let RNGIndex = Math.floor(Math.random() * moveOptions.length);
  return moveOptions[RNGIndex];
};

export function pigReducer(state: PigState, action: PigAction) {
  switch (action.type) {
    case "movement":
      if (
        state.puzzleCompleted ||
        !characterCanMove(state.playerLocation, action.direction)
      )
        return state;
      const nextPlayerLocation = moveCharacter[action.direction](
        state.playerLocation
      );
      //need to winCheck HERE
      if (nextPlayerLocation === state.pigLocation) {
        return {
          ...state,
          playerLocation: nextPlayerLocation,
          feedback: pigFeedback.success,
          showFeedback: true,
          puzzleCompleted: true,
        };
      }
      const nextPigLocation = movePig(state.pigLocation, nextPlayerLocation);

      return {
        ...state,
        playerLocation: nextPlayerLocation,
        pigLocation: nextPigLocation,
      };

    case "reset":
      return initialPigState;
    default:
      return state;
  }
}
