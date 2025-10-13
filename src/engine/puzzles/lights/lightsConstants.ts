// Types
export type LightsColor = (typeof TARGET_ORDER)[number];

export interface LightsState {
  curOrder: LightsColor[];
  feedback: string[];
  turns: number;
  switchesActive: boolean;
  puzzleCompleted: boolean;
}

// Config
export const INITAL_ORDER = ["Yellow", "Red", "Green", "Blue"] as const;
export const TARGET_ORDER = ["Blue", "Green", "Red", "Yellow"] as const;
export const TARGET_TURNS = 4;

// Narrative Content
export const lightsFeedback = {
  initial: [
    "Right. You see the lights as they are but they should be like this:",
    "           BLUE, GREEN, RED, YELLOW",
    "That's in alphabetical order. We have to use switches 1,2,3 and 4 to do this.",
    "Try pressing the switches below...",
    " ",
  ],
  optimised: [
    "The electrician thanks you for your help. She wishes you luck and warns you to be careful.",
    `"These Drogos aren't to be trusted"`,
    'Your attention is caught by a roughly-carved wooden oar which is propped up in one corner of the room. The electrician notices your interest and says, "You can have that if you want it."',
  ],
  subOptimal: [
    `"You've done it," says the electrician, "but my apprentice, who is on holiday, reckons she can do it in four moves!"`,
    "Will you try again? (RESET or LEAVE)",
  ],
  reset: [`"OK, let's start again." says the electrician.`],
  storyLineSuccess:
    "The electrician thanks you for your help, and turns back to the sound system.",

  storyLineFailure:
    'The electrician looks hopefully at you - "Will you have another go?"',
};

// Initial State
export const initialLightsState: LightsState = {
  curOrder: [...INITAL_ORDER],
  feedback: lightsFeedback.initial,
  turns: 0,
  switchesActive: true,
  puzzleCompleted: false,
};
