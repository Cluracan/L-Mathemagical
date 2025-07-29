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
  resetGameStore: () => void;
};

export type GameStore = GameStoreState & GameStoreActions;

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      playerName: "a",
      modernMode: false,
      currentRoom: "grass",
      storyLine: [
        'It is a very hot day. You are sitting on the grass outside a crumbling palace. Your sister is reading a book called "Fractions and the Four Rules-- 5000 Carefully Graded Problems". You are bored, and the heat is making you feel a little sleepy. \n\nSuddenly you see an old man dressed as an abbot. He glances at you nervously and slips through the palace doors to the north.',
      ],
      stepCount: 0,
      roomsVisited: new Set(["grass"]),
      toggleGameMode: () => set((state) => ({ modernMode: !state.modernMode })),
      setPlayerName: (playerName: string) => set({ playerName }),
      setCurrentRoom: (roomId: RoomId) => set({ currentRoom: roomId }),
      sendToStoryLine: (storyText: string) =>
        set((state) => ({ storyLine: [...state.storyLine, storyText] })),
      increaseStepCount: () =>
        set((state) => ({ stepCount: state.stepCount + 1 })),
      addToRoomsVisited: (roomId: RoomId) =>
        set((state) => ({ roomsVisited: state.roomsVisited.add(roomId) })),
      resetGameStore: () => {
        set(useGameStore.getInitialState());
      },
    }),
    {
      name: "l-game-storage",
    }
  )
);
