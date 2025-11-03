import { useGameStore } from "../store/useGameStore";

export const saveGame = () => {
  let link: HTMLAnchorElement | null = null;
  let url: string | null = null;
  try {
    const state = useGameStore.getState();
    const filteredState = Object.fromEntries(
      Object.entries(state).filter(([_, value]) => typeof value !== "function")
    );
    const json = JSON.stringify(filteredState);
    const blob = new Blob([json], { type: "application/json" });
    url = URL.createObjectURL(blob);
    link = document.createElement("a");
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
  } finally {
    if (link && document.body.contains(link)) {
      document.body.removeChild(link);
    }
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
};
