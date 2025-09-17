//Types
export type TreeState = {
  selectedCells: boolean[];
  feedback: string[];
  puzzleCompleted: boolean;
};

//Constants
export const ORCHARD_SIZE = 25;
export const ORCHARD_WIDTH = 5;
export const TREE_COUNT = 9;

//Static Data
export const treeFeedback = {
  default: [
    '"Right," says the gardener.  Click on a square and I\'ll either plant or remove a tree there. Click CHECK if you think you are finished, RESET if you want me to start from scratch, or LEAVE if you want a break.',
  ],
  success: [
    " ",
    '"Thank goodness," sighs the gardener, "I was beginning to think it was impossible. Now I have something to give you."',
    "He hands you a rope ladder which is rolled up into a neat bundle.",
  ],
  reset: [
    " ",
    "The gardener sighs, and removes all trees from the orchard.",
    '"Ok, let\'s try again!"',
  ],
  leaveWithSuccess: [
    "The gardener thanks you for your help, and then wanders off to tend some other fruit trees.",
  ],
  leaveWithFailure: [
    'The gardener looks around at the pile of trees - "Do come back when you are ready to try again please!"',
  ],
};

//Initial State
export const initialTreeState: TreeState = {
  selectedCells: Array.from({ length: ORCHARD_SIZE }, () => false),
  feedback: treeFeedback.default,
  puzzleCompleted: false,
};
