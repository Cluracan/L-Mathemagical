import { describe, it, expect } from "vitest";
import { runRingTriggers } from "../../../src/engine/events/runRingTriggers";
import { initialPipelinePayload } from "../../../tests/data/initialPipelinePayload";
import type { PipelinePayload } from "../../../src/engine/actions/dispatchCommand";
import { produce } from "immer";

const getRingPayload: PipelinePayload = produce(
  initialPipelinePayload,
  (draft) => {
    draft.command = "get";
    draft.target = "ring";
    draft.gameState.itemLocation.ring = "grass";
  }
);

describe("runRingTriggers", () => {
  it("makes player invisible when picking up ring", () => {
    const result = runRingTriggers(getRingPayload);
    expect(result.gameState.isInvisible).toBe(true);
    expect(result.gameState.itemLocation.ring).toBe("player");
    expect(result.gameState.storyLine.at(-1)).toContain("pick up the ring");
    expect(result.done).toBe(true);
  });

  it("removes invisibility when dropping the ring", () => {
    const dropRingPayload: PipelinePayload = produce(
      initialPipelinePayload,
      (draft) => {
        draft.command = "drop";
        draft.target = "ring";
        draft.gameState.itemLocation.ring = "player";
      }
    );

    const result = runRingTriggers(dropRingPayload);
    expect(result.gameState.isInvisible).toBe(false);
    expect(result.gameState.itemLocation.ring).toBe("grass");
    expect(result.gameState.storyLine.at(-1)).toContain("drop the ring");
    expect(result.done).toBe(true);
  });

  it("ignores non-ring targets", () => {
    const result = runRingTriggers({ ...getRingPayload, target: "torch" });
    expect(result).toStrictEqual({ ...getRingPayload, target: "torch" });
  });
});
