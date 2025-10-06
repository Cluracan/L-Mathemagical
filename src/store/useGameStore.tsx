import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialItemLocation, initialKeyLocked } from "../assets/data/itemData";
import { roomRegistry } from "../engine/world/roomRegistry";
import type { RoomId } from "../assets/data/roomData";
import type { ItemId, KeyId } from "../assets/data/itemData";
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

export interface GameStoreState {
  playerName: string;
  modernMode: boolean;
  currentRoom: RoomId;
  visitedRooms: RoomId[];
  storyLine: string[];
  stepCount: number;
  itemLocation: Record<ItemId, RoomId | "player">;
  keyLocked: Record<KeyId, boolean>;
  playerHeight: "threeFifths" | "threeFourths" | "one" | "fiveFourths";
  isInvisible: boolean;
  bathState: BathState;
  drogoGuard: null | { target: number; turnsUntilCaught: number };
  currentPuzzle: PuzzleId | null;
  puzzleState: {
    abbot: AbbotState;
    ape: ApeState;
    calculator: CalculatorState;
    cook: CookState;
    key: KeyState;
    lights: LightsState;
    piano: PianoState;
    pig: PigState;
    snooker: SnookerState;
    telephone: TelephoneState;
    tree: TreeState;
    turtle: TurtleState;
  };
  showDialog: boolean;
}

interface GameStoreActions {
  setPlayerName: (playerName: string) => void;
  toggleGameMode: () => void;
  resetGameStore: () => void;
}

export type GameStore = GameStoreState & GameStoreActions;

const initialGameState: GameStoreState = {
  playerName: "player 1",
  modernMode: true,
  currentRoom: "grass",
  visitedRooms: ["grass"],
  storyLine: [roomRegistry.getLongDescription("grass")],
  stepCount: 0,
  itemLocation: initialItemLocation,
  keyLocked: initialKeyLocked,
  playerHeight: "one",
  isInvisible: false,
  bathState: initialBathState,
  drogoGuard: null,
  currentPuzzle: null,
  puzzleState: {
    abbot: initialAbbotState,
    ape: initialApeState,
    calculator: initialCalculatorState,
    cook: initialCookState,
    key: initialKeyState,
    lights: initialLightsState,
    piano: initialPianoState,
    pig: initialPigState,
    snooker: initialSnookerState,
    telephone: initialTelephoneState,
    tree: initialTreeState,
    turtle: initialTurtleState,
  },
  showDialog: false,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialGameState,
      toggleGameMode: () => {
        set((state) => ({ modernMode: !state.modernMode }));
      },
      setPlayerName: (playerName: string) => {
        set({ playerName });
      },
      resetGameStore: () => {
        set(initialGameState);
      },
    }),
    {
      name: "l-game-storage",
    }
  )
);
