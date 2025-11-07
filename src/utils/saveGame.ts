import { produce } from "immer";
import {
  SAVE_VERSION,
  useGameStore,
  type GameStoreState,
} from "../store/useGameStore";

export interface SaveFile {
  version: string;
  gameData: GameStoreState;
}

export const saveGame = () => {
  let link: HTMLAnchorElement | null = null;
  let url: string | null = null;
  try {
    const state = useGameStore.getState();
    const saveFile: SaveFile = {
      version: SAVE_VERSION,
      gameData: state,
    };

    const json = JSON.stringify(saveFile);
    const blob = new Blob([json], { type: "application/json" });
    url = URL.createObjectURL(blob);
    link = document.createElement("a");
    link.href = url;
    const fileName = `L_${state.playerName}_${String(Date.now())}.sav`;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);

    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.storyLine.push({
          type: "description",
          text: "Game saved",
          isEncrypted: false,
        });
      })
    );
  } catch (err) {
    console.error("Save game failed", err);
    useGameStore.setState((state) =>
      produce(state, (draft) => {
        draft.storyLine.push({
          type: "warning",
          text: "Error saving game",
          isEncrypted: false,
        });
      })
    );
  } finally {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
};
