//Types
export type PigState = {
  feedback: string[];
  showInstructions: boolean;
  playerMovesFirst: boolean;
  playerLocation: number;
  pigLocation: number;
  puzzleCompleted: boolean;
};

//Constants
const INITIAL_PLAYER_LOCATION = 12;
const INITIAL_PIG_LOCATION = 2;
export const GRID_SIZE = 25;
export const GRID_WIDTH = 5;

//Static Data
export const pigFeedback = {
  instructions: [
    `The floor of this room is divided into ${GRID_SIZE} squares.`,
    "You can move around the room using the ARROW keys, or by using W,A,S,D on the keyboard. You can RESET (returns to this screen) or LEAVE at any time.",
    "Would you like to move first?",
  ],
};

//Initial State
export const initialPigState: PigState = {
  feedback: [],
  showInstructions: true,
  playerMovesFirst: true,
  playerLocation: INITIAL_PLAYER_LOCATION,
  pigLocation: INITIAL_PIG_LOCATION,
  puzzleCompleted: false,
};
