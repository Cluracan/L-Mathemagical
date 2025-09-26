import { abbotHallwayNPC, abbotKitchenNPC, abbotNPC } from "./abbot/abbotNPC";
import { handleAbbotPuzzle } from "./abbot/handleAbbotPuzzle";
import { lightsNPC } from "./lights/lightsNPC";
import { LightsPuzzle } from "./lights/LightsPuzzle";
import { createKeyGuard } from "../../utils/guards";
import type { PuzzleNPC } from "./types";
import type { PipelineFunction } from "../pipeline/types";
import type { RoomId } from "../../assets/data/roomData";

import { KeyPuzzle } from "./key/KeyPuzzle";
import { turtleNPC } from "./turtle/turtleNPC";
import { handleTurtlePuzzle } from "./turtle/handleTurtlePuzzle";
import { treeNPC } from "./tree/treeNPC";
import { TreePuzzle } from "./tree/TreePuzzle";
import { calculatorNPC } from "./calculator/calculatorNPC";
import { CalculatorPuzzle } from "./calculator/CalculatorPuzzle";
import { keyNPC } from "./key/keyNPC";
import { cookNPC } from "./cook/cookNPC";
import { CookPuzzle } from "./cook/CookPuzzle";
import { pianoNPC } from "./piano/pianoNPC";
import { PianoPuzzle } from "./piano/PianoPuzzle";
import { pigNPC } from "./pig/pigNPC";
import { PigPuzzle } from "./pig/PigPuzzle";

export const puzzleAtLocation = {
  store: {
    puzzleId: "abbot",
    puzzleNPC: abbotNPC,
  },

  hallway: {
    puzzleId: "abbot",
    puzzleNPC: abbotHallwayNPC,
  },
  kitchen: {
    puzzleId: "abbot",
    puzzleNPC: abbotKitchenNPC,
  },
  largeKitchen: { puzzleId: "cook", puzzleNPC: cookNPC },
  lights: {
    puzzleId: "lights",
    puzzleNPC: lightsNPC,
  },
  file: {
    puzzleId: "key",
    puzzleNPC: keyNPC,
  },
  music: {
    puzzleId: "piano",
    puzzleNPC: pianoNPC,
  },
  pig: {
    puzzleId: "pig",
    puzzleNPC: pigNPC,
  },
  courtyard: {
    puzzleId: "turtle",
    puzzleNPC: turtleNPC,
  },
  orchard: {
    puzzleId: "tree",
    puzzleNPC: treeNPC,
  },
  broomCupboard: {
    puzzleId: "calculator",
    puzzleNPC: calculatorNPC,
  },
} as const satisfies Partial<
  Record<
    RoomId,
    {
      puzzleId: string;
      puzzleNPC: PuzzleNPC;
    }
  >
>;

export const puzzleRegistry = {
  abbot: {
    pipelineFunction: handleAbbotPuzzle,
    component: null,
  },
  calculator: {
    pipelineFunction: null,
    component: CalculatorPuzzle,
  },
  cook: {
    pipelineFunction: null,
    component: CookPuzzle,
  },
  lights: {
    pipelineFunction: null,
    component: LightsPuzzle,
  },
  key: {
    pipelineFunction: null,
    component: KeyPuzzle,
  },
  piano: {
    pipelineFunction: null,
    component: PianoPuzzle,
  },
  pig: {
    pipelineFunction: null,
    component: PigPuzzle,
  },
  turtle: {
    pipelineFunction: handleTurtlePuzzle,
    component: null,
  },
  tree: {
    pipelineFunction: null,
    component: TreePuzzle,
  },
} as const satisfies Partial<
  Record<
    string,
    {
      pipelineFunction: PipelineFunction | null;
      component: React.FunctionComponent<{ visible: boolean }> | null;
    }
  >
>;

export type PuzzleId = keyof typeof puzzleRegistry;

export const isPuzzleLocation = createKeyGuard(puzzleAtLocation);
