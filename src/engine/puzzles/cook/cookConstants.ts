//Types
export interface CookState {
  feedback: string[];
  ingredients: Record<Ingredient, number>;
  cakeHeight: number;
  puzzleCompleted: boolean;
}

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

  success: [
    '"Thenk goodness!" beams the cook, tasting the cake. "It\'s rather salty, but it\'s just the right size."',
    'The cook fumbles in a drawer and hands something to you. "I found this yesterday. It\'s of not use to me." You are holding an icosahedron made of highly polished jade',
  ],
  storyLineSuccess:
    "The cook collapses at the table in relief, and instantly falls asleep.",
  storyLineFailure:
    'The cook looks hopefully at you."Please have another go when you are ready!"',
};

export const getFailureFeedback = (cakeHeight: number) => {
  if (cakeHeight <= MIN_HEIGHT) {
    return '"Oh no!", cries the cook. "Will you try again?';
  } else if (cakeHeight < 0.7 * MIN_HEIGHT + 0.3 * TARGET_HEIGHT) {
    return '"Well it\'s a start" beams the cook. "Please keep going!';
  } else if (cakeHeight < 0.3 * MIN_HEIGHT + 0.7 * TARGET_HEIGHT) {
    return '"That\'s getting better", says the cook. "Will you try again?"';
  } else {
    return '"So close!", cries the cook. "Please keep trying!"';
  }
};

export const getCakeHeightFeedback = (
  ingredients: Record<Ingredient, number>,
  cakeHeight: number
) => {
  const { TOLT, FIMA, MUOT } = ingredients;

  return [
    " ",
    `The cook adds ${String(TOLT)}g of TOLT, ${String(FIMA)}g of FIMA, and ${String(MUOT)}g of MUOT to the mixture, places it into the oven and after a few minutes takes out the cake.`,
    cakeHeight === MIN_HEIGHT
      ? `The cake is only ${String(MIN_HEIGHT)}cm high and doesn't seem to have risen at all.`
      : `The cake has risen to ${cakeHeight.toFixed(1)}cm...`,
  ];
};

//Initial State
export const initialCookState: CookState = {
  feedback: cookFeedback.initial,
  ingredients: { TOLT: 0, FIMA: 0, MUOT: 0 },
  cakeHeight: 9,
  puzzleCompleted: false,
};
