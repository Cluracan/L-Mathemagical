import type { PipelineFunction } from "../../pipeline/types";

// ---Helper Fuctions---
export interface BatState {
  puzzleCompleted: boolean;
}

// ---Initial State---
export const initialBatState: BatState = {
  puzzleCompleted: false,
};

// --- Main Function ---
export const handleBatPuzzle: PipelineFunction = (payload) => {
  const { command, target, gameState } = payload;
  console.log(command, target);
  switch (command) {
    case "say": {
      const value = Number(target);
      if (!isNaN(value)) {
        console.log(value);
      }
    }
  }

  return payload;
};
