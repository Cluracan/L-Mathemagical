import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialItemLocation } from "../assets/data/itemData";
import { initialKeyLocked } from "../assets/data/itemData";
import { roomRegistry } from "../engine/world/roomRegistry";
import type { RoomId } from "../assets/data/roomData";
import type { ItemId, KeyId } from "../assets/data/itemData";
import {
  initialBathState,
  type BathState,
} from "../engine/events/runBathTriggers";
import {
  initialPuzzleCompletedState,
  type PuzzleId,
} from "../engine/puzzles/puzzleRegistry";

import {
  initialLightsFeedback,
  initialLightsOrder,
} from "../engine/puzzles/lights/LightsPuzzle";

export type GameStoreState = {
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
  puzzleCompleted: Record<PuzzleId, boolean>;
  currentPuzzle: PuzzleId | null;
  puzzleState: {
    abbot: { dialogIndex: number };
    lights: {
      curOrder: string[];
      feedback: string[];
      turns: number;
      switchesActive: boolean;
    };
    file: {};
  };
  showDialog: boolean;
};

type GameStoreActions = {
  setPlayerName: (playerName: string) => void;
  toggleGameMode: () => void;
  resetGameStore: () => void;
};

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
  puzzleCompleted: initialPuzzleCompletedState,
  currentPuzzle: null,
  puzzleState: {
    abbot: { dialogIndex: 0 },
    lights: {
      curOrder: initialLightsOrder,
      feedback: initialLightsFeedback,
      turns: 0,
      switchesActive: true,
    },
    file: {},
  },
  showDialog: false,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialGameState,
      toggleGameMode: () => set((state) => ({ modernMode: !state.modernMode })),
      setPlayerName: (playerName: string) => set({ playerName }),
      resetGameStore: () => set(() => initialGameState),
    }),
    {
      name: "l-game-storage",
    }
  )
);
