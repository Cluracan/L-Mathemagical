import { produce } from "immer";
import type { EntryType } from "../../store/useGameStore";
import type { PipelinePayload } from "./types";

interface Args {
  payload: PipelinePayload;
  text: string | null;
  type: EntryType;
}

export const stopWithStoryLineEntry = (args: Args): PipelinePayload => {
  const { payload, text, type } = args;
  return produce(payload, (draft) => {
    if (text) {
      draft.gameState.storyLine.push({
        type,
        text,
        isEncrypted: draft.gameState.encryptionActive,
      });
    }
    draft.done = true;
  });
};
