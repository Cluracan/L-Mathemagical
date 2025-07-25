import { create } from "zustand";
import { persist } from "zustand/middleware";

type GameModeStore = {
  modernMode: boolean;
  toggleGameMode: () => void;
};

export const useGameMode = create<GameModeStore>()(
  persist(
    (set) => ({
      modernMode: false,
      toggleGameMode: () => set((state) => ({ modernMode: !state.modernMode })),
    }),
    {
      name: "game-mode-storage",
    }
  )
);
