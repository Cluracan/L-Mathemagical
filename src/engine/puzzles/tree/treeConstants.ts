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

export const checkRows = [
  [2, 6, 10],
  [3, 7, 11, 15],
  [4, 8, 12, 16, 20],
  [9, 13, 17, 21],
  [14, 16, 22],
  [2, 8, 14],
  [1, 7, 13, 19],
  [0, 6, 12, 18, 24],
  [5, 11, 17, 23],
  [10, 16, 22],
  [0, 7, 14],
  [5, 12, 19],
  [10, 17, 24],
  [4, 7, 10],
  [9, 12, 15],
  [14, 17, 20],
  [0, 11, 22],
  [1, 12, 23],
  [2, 13, 24],
  [2, 11, 20],
  [3, 12, 21],
  [4, 13, 22],
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
];

//Initial State
export const initialTreeState: TreeState = {
  selectedCells: Array.from({ length: ORCHARD_SIZE }, () => false),
  feedback: treeFeedback.default,
  puzzleCompleted: false,
};
