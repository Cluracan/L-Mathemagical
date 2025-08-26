import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialItemLocation } from "../assets/data/itemData";
import { initialKeyLocked } from "../assets/data/itemData";
import { roomRegistry } from "../engine/world/roomRegistry";
import type { RoomId } from "../assets/data/roomData";
import type { ItemId } from "../assets/data/itemData";
import {
  initialBathState,
  type BathState,
} from "../engine/events/runBathTriggers";

export type GameStoreState = {
  playerName: string;
  modernMode: boolean;
  currentRoom: RoomId;
  isInvisible: boolean;
  itemLocation: Record<ItemId, RoomId | "player">;
  keyLocked: Partial<Record<ItemId, boolean>>;
  playerHeight: "threeFifths" | "threeFourths" | "one" | "fiveFourths";
  storyLine: string[];
  stepCount: number;
  visitedRooms: RoomId[];
  bathState: BathState;
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
  itemLocation: initialItemLocation,
  isInvisible: false,
  keyLocked: initialKeyLocked,
  playerHeight: "one",
  storyLine: [roomRegistry.getLongDescription("grass")],
  stepCount: 0,
  visitedRooms: ["grass"],
  bathState: initialBathState,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialGameState,
      toggleGameMode: () => set((state) => ({ modernMode: !state.modernMode })),
      setPlayerName: (playerName: string) => set({ playerName }),
      resetGameStore: () => {
        set(useGameStore.getInitialState());
      },
    }),
    {
      name: "l-game-storage",
    }
  )
);
