import { useGameStore } from "../store/useGameStore";

export const saveGame = () => {
  try {
    const state = useGameStore.getState();
    const filteredState = Object.fromEntries(
      Object.entries(state).filter(([_, value]) => typeof value !== "function")
    );
    const json = JSON.stringify(filteredState);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = `L-Mathemagical_Save_${state.playerName}_${String(Date.now())}.json`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    useGameStore.setState((state) => ({
      ...state,
      storyLine: [
        ...state.storyLine,
        { type: "description", text: "Game saved", isEncrypted: false },
      ],
    }));
  } catch (err) {
    console.error("Save game failed", err);
    useGameStore.setState((state) => ({
      ...state,
      storyLine: [
        ...state.storyLine,
        { type: "warning", text: "Error saving game", isEncrypted: false },
      ],
    }));
  }
};
