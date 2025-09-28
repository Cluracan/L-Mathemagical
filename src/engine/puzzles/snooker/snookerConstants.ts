//Types
export type SnookerState = {
  puzzleCompleted: boolean;
  angle: number;
  feedback: string;
  action: "reset" | "hit" | "idle";
};

//Static Data
export const snookerFeedback = {
  default:
    "Give the angle (in degrees) between the path of the ball and the direction of the pocket.",
  success: "The ball lands in the hole! Click RESET to play again.",
};

//Initial State
export const initialSnookerState: SnookerState = {
  puzzleCompleted: false,
  angle: 0,
  feedback: snookerFeedback.default,
  action: "reset",
};
