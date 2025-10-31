import { produce } from "immer";
import type { PipelinePayload } from "./types";
import type { EntryType } from "../../store/useGameStore";

interface FailCommandArgs {
  payload: PipelinePayload;
  text: string;
  type: EntryType;
}
export const failCommand = (args: FailCommandArgs): PipelinePayload => {
  const { payload, text, type } = args;
  return produce(payload, (draft) => {
    draft.gameState.storyLine.push({
      type,
      text,
      isEncrypted: draft.gameState.encryptionActive,
    });
    draft.done = true;
  });
};
