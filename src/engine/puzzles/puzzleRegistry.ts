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
import { SnookerPuzzle } from "./snooker/SnookerPuzzle";
import { snookerNPC } from "./snooker/snookerNPC";
import { apeNPC } from "./ape/apeNPC";
import { handleApePuzzle } from "./ape/handleApePuzzle";
import { ApePuzzle } from "./ape/ApePuzzle";
import { telephoneNPC } from "./telephone/telephoneNPC";
import { TelephonePuzzle } from "./telephone/TelephonePuzzle";
import { safeNPC } from "./safe/safeNPC";
import { SafePuzzle } from "./safe/SafePuzzle";
import { batNPC } from "./bat/batNPC";
import { handleBatPuzzle } from "./bat/handleBatPuzzle";
import { spiderNPC } from "./spider/spiderNPC";
import { SpiderPuzzle } from "./spider/SpiderPuzzle";
import { computerNPC } from "./computer/computerNPC";
import { ComputerPuzzle } from "./computer/ComputerPuzzle";

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
  riverN: {
    puzzleId: "ape",
    puzzleNPC: apeNPC,
  },
  triangle: {
    puzzleId: "bat",
    puzzleNPC: batNPC,
  },
  broomCupboard: {
    puzzleId: "calculator",
    puzzleNPC: calculatorNPC,
  },
  computer: {
    puzzleId: "computer",
    puzzleNPC: computerNPC,
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
  safe: {
    puzzleId: "safe",
    puzzleNPC: safeNPC,
  },
  snooker: {
    puzzleId: "snooker",
    puzzleNPC: snookerNPC,
  },
  spider: {
    puzzleId: "spider",
    puzzleNPC: spiderNPC,
  },
  telephone: {
    puzzleId: "telephone",
    puzzleNPC: telephoneNPC,
  },
  courtyard: {
    puzzleId: "turtle",
    puzzleNPC: turtleNPC,
  },
  orchard: {
    puzzleId: "tree",
    puzzleNPC: treeNPC,
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
  ape: {
    pipelineFunction: handleApePuzzle,
    component: ApePuzzle,
  },
  bat: {
    pipelineFunction: handleBatPuzzle,
    component: null,
  },
  calculator: {
    pipelineFunction: null,
    component: CalculatorPuzzle,
  },
  computer: {
    pipelineFunction: null,
    component: ComputerPuzzle,
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
  safe: {
    pipelineFunction: null,
    component: SafePuzzle,
  },
  snooker: {
    pipelineFunction: null,
    component: SnookerPuzzle,
  },
  spider: {
    pipelineFunction: null,
    component: SpiderPuzzle,
  },
  telephone: {
    pipelineFunction: null,
    component: TelephonePuzzle,
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
