import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RoomId } from "../assets/data/RoomId";

type GameStoreState = {
  playerName: string;
  modernMode: boolean;
  currentRoom: RoomId;
  storyLine: string[];
  stepCount: number;
  roomsVisited: Set<RoomId>;
};

type GameStoreActions = {
  setPlayerName: (playerName: string) => void;
  toggleGameMode: () => void;
  setCurrentRoom: (roomId: RoomId) => void;
  sendToStoryLine: (storyText: string) => void;
  increaseStepCount: () => void;
  addToRoomsVisited: (roomId: RoomId) => void;
};

export type GameStore = GameStoreState & GameStoreActions;

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      playerName: "a",
      modernMode: false,
      currentRoom: "grass",
      storyLine: [],
      stepCount: 0,
      roomsVisited: new Set(),
      toggleGameMode: () => set((state) => ({ modernMode: !state.modernMode })),
      setPlayerName: (playerName: string) => set({ playerName }),
      setCurrentRoom: (roomId: RoomId) => set({ currentRoom: roomId }),
      sendToStoryLine: (storyText: string) =>
        set((state) => ({ storyLine: [...state.storyLine, storyText] })),
      increaseStepCount: () =>
        set((state) => ({ stepCount: state.stepCount + 1 })),
      addToRoomsVisited: (roomId: RoomId) =>
        set((state) => ({ roomsVisited: state.roomsVisited.add(roomId) })),
    }),
    {
      name: "l-game-storage",
    }
  )
);
