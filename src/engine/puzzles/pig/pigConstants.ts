import { createKeyGuard } from "../../../utils/createKeyGuard";

// Types
export interface PigState {
  feedback: string;
  showFeedback: boolean;
  showInstructions: boolean;
  playerMovesFirst: boolean;
  playerLocation: number;
  pigLocation: number;
  puzzleCompleted: boolean;
}

export type CompassDirection = "n" | "e" | "s" | "w";

// Config
export const INITIAL_PLAYER_LOCATION = 12;
export const INITIAL_PIG_LOCATION = 2;
export const GRID_SIZE = 25;
export const GRID_WIDTH = 5;

// Narration Content
export const pigFeedback = {
  instructions: [
    `The floor of this room is divided into ${String(GRID_SIZE)} squares.`,
    "You can move around the room using the ARROW keys, or by using W,A,S,D on the keyboard.",
    "You can RESET or LEAVE at any time.",
  ],
  default: "Catch the pig!",
  success:
    "You have caught hold of the pig, which squeals and wriggles. It soon breaks free, but not before you have examined the piece of paper on its collar...it has one word written on it: NEUMANN",
  storyLineSuccess:
    "The pig wanders to the other side of the room while you consider the word written on the paper: NEUMANN",
  storyLineFailure:
    "The pig avoids your efforts to get close! Perhaps you should try again?",
};

export const directionText: Record<CompassDirection, string> = {
  n: "north",
  e: "east",
  s: "south",
  w: "west",
};

// Constants
export const directionAliases: Record<string, CompassDirection> = {
  ArrowUp: "n",
  ArrowDown: "s",
  ArrowLeft: "w",
  ArrowRight: "e",
  w: "n",
  s: "s",
  a: "w",
  d: "e",
  W: "n",
  S: "s",
  A: "w",
  D: "e",
};
export const isDirectionAlias = createKeyGuard(directionAliases);

// Initial State
export const initialPigState: PigState = {
  feedback: "",
  showFeedback: false,
  showInstructions: true,
  playerMovesFirst: true,
  playerLocation: INITIAL_PLAYER_LOCATION,
  pigLocation: INITIAL_PIG_LOCATION,
  puzzleCompleted: false,
};
