import { it, expect } from "vitest";
import { runBlockedTriggers } from "../../../src/engine/events/runBlockedTriggers";
import { initialPipelinePayload } from "../../data/initialPipelinePayload";
import { PipelinePayload } from "../../../src/engine/actions/dispatchCommand";
import { produce } from "immer";

it("returns payload unchanged if not a blocked room", () => {
  const unblockedPayload: PipelinePayload = produce(
    initialPipelinePayload,
    (draft) => {
      draft.command = "move";
      draft.target = "north";
      draft.gameState.currentRoom = "code";
    }
  );
  const result = runBlockedTriggers(unblockedPayload);
  expect(result).toEqual(unblockedPayload);
});

it("aborts if moving in a blocked direction without key", () => {
  const blockedPayload: PipelinePayload = produce(
    initialPipelinePayload,
    (draft) => {
      draft.command = "move";
      draft.target = "e";
      draft.gameState.currentRoom = "file";
    }
  );

  const result = runBlockedTriggers(blockedPayload);
  expect(result.done).toBe(true);
  expect(result.gameState.success).toBe(false);
});
