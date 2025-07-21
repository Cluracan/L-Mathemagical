import { create } from "zustand";
import { persist } from "zustand/middleware";

type GameModeStore = {
  gameMode: "classic" | "modern";
  toggleGameMode: () => void;
};

export const useGameMode = create<GameModeStore>()(
  persist(
    (set) => ({
      gameMode: "classic",
      toggleGameMode: () =>
        set((state) => ({
          gameMode: state.gameMode === "classic" ? "modern" : "classic",
        })),
    }),
    {
      name: "game-mode-storage",
    }
  )
);
