import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialItemLocation, initialKeyLocked } from "../assets/data/itemData";
import { roomRegistry } from "../engine/world/roomRegistry";
import type { RoomId } from "../assets/data/roomData";
import type { ItemId, KeyId, PlayerHeight } from "../assets/data/itemData";
import {
  initialBathState,
  type BathState,
} from "../engine/events/runBathTriggers";
import { type PuzzleId } from "../engine/puzzles/puzzleRegistry";
import {
  initialKeyState,
  type KeyState,
} from "../engine/puzzles/key/keyConstants";
import {
  initialTurtleState,
  type TurtleState,
} from "../engine/puzzles/turtle/handleTurtlePuzzle";
import {
  initialTreeState,
  type TreeState,
} from "../engine/puzzles/tree/treeConstants";
import {
  initialCalculatorState,
  type CalculatorState,
} from "../engine/puzzles/calculator/calculatorConstants";
import {
  initialAbbotState,
  type AbbotState,
} from "../engine/puzzles/abbot/handleAbbotPuzzle";
import {
  initialCookState,
  type CookState,
} from "../engine/puzzles/cook/cookConstants";
import {
  initialPianoState,
  type PianoState,
} from "../engine/puzzles/piano/pianoConstants";
import {
  initialPigState,
  type PigState,
} from "../engine/puzzles/pig/pigConstants";
import {
  initialSnookerState,
  type SnookerState,
} from "../engine/puzzles/snooker/snookerConstants";
import {
  initialApeState,
  type ApeState,
} from "../engine/puzzles/ape/apeConstants";
import {
  initialTelephoneState,
  type TelephoneState,
} from "../engine/puzzles/telephone/telephoneConstants";
import {
  initialLightsState,
  type LightsState,
} from "../engine/puzzles/lights/lightsConstants";
import {
  initialSafeState,
  type SafeState,
} from "../engine/puzzles/safe/safeConstants";
import {
  initialBatState,
  type BatState,
} from "../engine/puzzles/bat/handleBatPuzzle";
import {
  initialSpiderState,
  type SpiderState,
} from "../engine/puzzles/spider/spiderConstants";
import type { DrogoGuard } from "../engine/events/runDrogoTriggers";
import {
  initialJailGuard,
  type JailGuard,
} from "../engine/events/runAtticTriggers";
import {
  initialComputerState,
  type ComputerState,
} from "../engine/puzzles/computer/computerConstants";
import { createKeyGuard } from "../utils/createKeyGuard";

// Constants
export const SAVE_VERSION = "1.0.0";
export const MAJOR_VERSION = SAVE_VERSION.split(".")[0];
// Types
export type EntryType = "input" | "description" | "action" | "warning";

export interface StoryLineEntry {
  type: EntryType;
  text: string;
  isEncrypted: boolean;
}

export interface GameStoreState {
  playerName: string;
  modernMode: boolean;
  currentRoom: RoomId;
  visitedRooms: RoomId[];
  storyLine: StoryLineEntry[];
  stepCount: number;
  itemLocation: Record<ItemId, RoomId | "player">;
  keyLocked: Record<KeyId, boolean>;
  playerHeight: PlayerHeight;
  isInvisible: boolean;
  bathState: BathState;
  drogoGuard: DrogoGuard;
  jailGuard: JailGuard;
  ladderFixed: boolean;
  encryptionActive: boolean;
  currentPuzzle: PuzzleId | null;
  puzzleState: {
    abbot: AbbotState;
    ape: ApeState;
    bat: BatState;
    calculator: CalculatorState;
    computer: ComputerState;
    cook: CookState;
    key: KeyState;
    lights: LightsState;
    piano: PianoState;
    pig: PigState;
    safe: SafeState;
    snooker: SnookerState;
    spider: SpiderState;
    telephone: TelephoneState;
    tree: TreeState;
    turtle: TurtleState;
  };
  showDialog: boolean;
}

export type GameStore = GameStoreState;

// Initial State
export const initialGameState = {
  playerName: "player 1",
  modernMode: true,
  currentRoom: "grass",
  visitedRooms: ["grass"],
  storyLine: [
    {
      type: "description",
      text: roomRegistry.getLongDescription("grass"),
      isEncrypted: false,
    },
  ],
  stepCount: 0,
  itemLocation: initialItemLocation,
  keyLocked: initialKeyLocked,
  playerHeight: "one",
  isInvisible: false,
  bathState: initialBathState,
  drogoGuard: null,
  jailGuard: initialJailGuard,
  ladderFixed: false,
  encryptionActive: false,
  currentPuzzle: null,
  puzzleState: {
    abbot: initialAbbotState,
    ape: initialApeState,
    bat: initialBatState,
    calculator: initialCalculatorState,
    computer: initialComputerState,
    cook: initialCookState,
    key: initialKeyState,
    lights: initialLightsState,
    piano: initialPianoState,
    pig: initialPigState,
    safe: initialSafeState,
    snooker: initialSnookerState,
    spider: initialSpiderState,
    telephone: initialTelephoneState,
    tree: initialTreeState,
    turtle: initialTurtleState,
  },
  showDialog: false,
} as const satisfies GameStoreState;

export const isGameStoreKey = createKeyGuard(initialGameState);
export const isPuzzleStateKey = createKeyGuard(initialGameState.puzzleState);

// GameStore
export const useGameStore = create<GameStore>()(
  persist(
    (_) => ({
      ...initialGameState,
    }),
    {
      name: "l-mathemagical",
    }
  )
);
