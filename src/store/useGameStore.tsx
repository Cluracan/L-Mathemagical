import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialItemLocation } from "../assets/data/itemData";
import { initialKeyLocked } from "../assets/data/itemData";
import { roomRegistry } from "../engine/world/roomRegistry";
import type { RoomId } from "../assets/data/roomData";
import type { ItemId } from "../assets/data/itemData";

export type GameStoreState = {
  playerName: string;
  playerHeight: "threeFifths" | "threeFourths" | "one" | "fiveFourths";
  modernMode: boolean;
  currentRoom: RoomId;
  isInvisible: boolean;
  itemLocation: Partial<Record<ItemId, RoomId | "player">>;
  keyLocked: Partial<Record<ItemId, boolean>>;
  storyLine: string[];
  stepCount: number;
  visitedRooms: RoomId[];
};

type GameStoreActions = {
  setPlayerName: (playerName: string) => void;
  toggleGameMode: () => void;
  setCurrentRoom: (roomId: RoomId) => void;
  sendToStoryLine: (storyText: string) => void;
  resetGameStore: () => void;
};

export type GameStore = GameStoreState & GameStoreActions;

const initialGameState: GameStoreState = {
  playerName: "player 1",
  playerHeight: "one",
  modernMode: true,
  currentRoom: "grass",
  itemLocation: initialItemLocation,
  isInvisible: false,
  keyLocked: initialKeyLocked,
  storyLine: [roomRegistry.getLongDescription("grass")],
  stepCount: 0,
  visitedRooms: ["grass"],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialGameState,
      toggleGameMode: () => set((state) => ({ modernMode: !state.modernMode })),
      setPlayerName: (playerName: string) => set({ playerName }),
      setCurrentRoom: (roomId: RoomId) => set({ currentRoom: roomId }),
      sendToStoryLine: (storyText: string) =>
        set((state) => ({ storyLine: [...state.storyLine, storyText] })),
      resetGameStore: () => {
        set(useGameStore.getInitialState());
      },
    }),
    {
      name: "l-game-storage",
    }
  )
);
