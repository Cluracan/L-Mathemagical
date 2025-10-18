import type { RoomId } from "../../../assets/data/roomData";
import { roomRegistry } from "../../world/roomRegistry";

// Types
export interface ComputerState {
  feedback: string[][];
  inputValue: string[];
  recursionLevel: number;
  currentLocation: RoomId;
  puzzleCompleted: boolean;
}

// Config
const MAX_RECURSION = 3;

// Narrative Content
export const computerFeedback = {
  initial: roomRegistry.getLongDescription("hallway"),
};

// Initial State
export const initialComputerState: ComputerState = {
  feedback: [
    [computerFeedback.initial],
    [computerFeedback.initial],
    [computerFeedback.initial],
  ],
  inputValue: ["zero", "one", "two"],
  recursionLevel: 1,
  currentLocation: "hallway",
  puzzleCompleted: false,
};
