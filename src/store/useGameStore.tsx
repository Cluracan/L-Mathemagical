import { create } from "zustand";
import { persist } from "zustand/middleware";
import { itemData } from "../assets/data/itemData";
import { roomRegistry } from "../engine/world/roomRegistry";
import type { RoomId } from "../assets/data/roomData";
import type { ItemId } from "../assets/data/itemData";

type GameStoreState = {
  playerName: string;
  modernMode: boolean;
  currentRoom: RoomId;
  itemLocation: Record<ItemId, RoomId>;
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

const initialItemLocation = Object.values(itemData).reduce(
  (obj, item) => Object.assign(obj, { [item.id]: item.initialLocation }),
  {}
) as Record<ItemId, RoomId>;

const initialGameState: GameStoreState = {
  playerName: "player 1",
  modernMode: false,
  currentRoom: "grass",
  itemLocation: { ...initialItemLocation },
  storyLine: [roomRegistry.getLongDescription("grass")],
  stepCount: 0,
  roomsVisited: new Set(["grass"]),
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
