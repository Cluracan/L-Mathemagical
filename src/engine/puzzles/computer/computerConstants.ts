import type { RoomId } from "../../../assets/data/roomData";
import { roomRegistry } from "../../world/roomRegistry";

// Types
export interface ComputerState {
  feedback: Record<number, string[]>;
  recursionLevel: number;
  currentLocation: RoomId;
  puzzleCompleted: boolean;
}

// Config
export const MAX_RECURSION = 2;

// Narrative Content
export const computerFeedback = {
  hallwayDescription: roomRegistry.getLongDescription("hallway"),
  computerDecription: roomRegistry.getLongDescription("computer"),
  storyLineSuccess:
    "You get up from the computer feeling slightly disorientated...",
};

// Initial State
export const initialComputerState: ComputerState = {
  feedback: {
    0: [
      computerFeedback.hallwayDescription,
      "The air is shimmering slightly, but this room looks vaguely familiar...",
    ],
    1: [
      computerFeedback.hallwayDescription,
      "There is a defnite haze in the air now, and you experience a slight weightlessness, almost as if you are somehow less real...",
    ],
    2: [
      computerFeedback.hallwayDescription,
      "You shake your head in an attempt to clear the feeling of diziness. As you hold your hands up to the light, you can almost...see...through...",
    ],
  },

  recursionLevel: 0,
  currentLocation: "hallway",
  puzzleCompleted: false,
};
