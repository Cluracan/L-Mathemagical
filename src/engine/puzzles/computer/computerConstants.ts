import type { RoomId } from "../../../assets/data/roomData";
import { createKeyGuard } from "../../../utils/createKeyGuard";
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
  recursionEntrance: {
    0: "The air is shimmering slightly, but this room looks vaguely familiar...",
    1: "There is a defnite haze in the air now, and you experience a slight weightlessness, almost as if you are somehow less real...",
    2: "You shake your head in an attempt to clear the feeling of diziness. As you hold your hands up to the light, you can almost...see...through...",
  },
};
export const isRecursionLevel = createKeyGuard(
  computerFeedback.recursionEntrance
);

// Initial State
export const initialComputerState: ComputerState = {
  feedback: {
    0: [
      computerFeedback.hallwayDescription,
      computerFeedback.recursionEntrance[0],
    ],
    1: [
      computerFeedback.hallwayDescription,
      computerFeedback.recursionEntrance[1],
    ],
    2: [
      computerFeedback.hallwayDescription,
      computerFeedback.recursionEntrance[2],
    ],
  },

  recursionLevel: 0,
  currentLocation: "hallway",
  puzzleCompleted: false,
};
