//Types
export type CookState = {
  feedback: string[];
  ingredients: Record<Ingredient, number>;
  cakeHeight: number;
  puzzleCompleted: boolean;
};

export type Ingredient = "TOLT" | "FIMA" | "MUOT";

//Constants
export const MAX_QUANTITY = 99;
export const TARGET_HEIGHT = 25;
export const MIN_HEIGHT = 9;

//Static Data
export const cookFeedback = {
  initial: [
    "The cook cheers up a bit.",
    '"You see those three jars of white powder labelled TOLT, FIMA and MUOT? Well I have to put in the right amount of each inredient."',
    '"I\'ll try another cake now, and you tell me how much of each to use."',
  ],
  storyLineSuccess:
    "The cook collapses at the table in relief, and instantly falls asleep.",
  storyLineFailure:
    'The cook looks hopefully at you."Please have another go when you are ready!"',
};

//Initial State
export const initialCookState: CookState = {
  feedback: cookFeedback.initial,
  ingredients: { TOLT: 0, FIMA: 0, MUOT: 0 },
  cakeHeight: 9,
  puzzleCompleted: false,
};
