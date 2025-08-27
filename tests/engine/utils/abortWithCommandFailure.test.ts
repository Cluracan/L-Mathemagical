import { describe, it, expect } from "vitest";
import { abortWithCommandFailure } from "../../../src/engine/utils/abortWithCommandFailure";

describe("abortWithCommandFailure", () => {
  it("marks payload as aborted and adds message", () => {
    const payload = {
      command: "move",
      target: "north",
      gameState: { storyLine: [], success: true, feedback: null },
    } as any;

    const result = abortWithCommandFailure(
      payload,
      "You can't go that way",
      "move"
    );

    expect(result.aborted).toBe(true);
    expect(result.gameState.storyLine).toContain("You can't go that way");
    expect(result.gameState.success).toBe(false);
    expect(result.gameState.feedback).toBe("move");
  });
});
