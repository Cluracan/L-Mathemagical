import { describe, it, expect } from "vitest";
import { runPoolTriggers } from "../../../src/engine/events/runPoolTriggers";
import { produce } from "immer";
import { initialCommandPayload } from "../../data/initialCommandPayload";

const basePayload = {
  command: "look",
  target: "hole",
  gameState: {
    storyLine: [],
    playerHeight: "threeFourths",
    currentRoom: "poolFloor",
  },
};

describe("runPoolTriggers", () => {
  it("returns payload unchanged if not in poolFloor", () => {
    const lookFailPayload = produce(initialCommandPayload, (draft) => {
      draft.command = "look";
      draft.target = "hole";
    });

    const result = runPoolTriggers(lookFailPayload);
    expect(result).toEqual(lookFailPayload);
  });

  it("adds storyLine when looking at hole in poolFloor", () => {
    const lookSuccessPayload = produce(initialCommandPayload, (draft) => {
      draft.command = "look";
      draft.target = "hole";
      draft.gameState.currentRoom = "poolFloor";
    });
    const payload = { ...basePayload, command: "look", target: "hole" };
    const result = runPoolTriggers(lookSuccessPayload);
    expect(result.gameState.storyLine.at(-1)).toContain(
      "Peering into the hole"
    );
    expect(result.aborted).toBe(true);
  });

  it("moves player to tunnelTop if height is threeFourths and moving in", () => {
    const moveSuccessPayload = produce(initialCommandPayload, (draft) => {
      draft.command = "move";
      draft.target = "in";
      draft.gameState.currentRoom = "poolFloor";
      draft.gameState.playerHeight = "threeFourths";
    });

    const result = runPoolTriggers(moveSuccessPayload);
    expect(result.gameState.currentRoom).toBe("tunnelTop");
    expect(
      result.gameState.storyLine.some((line) => line.includes("tight squeeze"))
    ).toBe(true);
    expect(result.aborted).toBe(true);
  });

  it("prevents moving in if height is not threeFourths", () => {
    const moveFailurePayload = produce(initialCommandPayload, (draft) => {
      draft.command = "move";
      draft.target = "in";
      draft.gameState.currentRoom = "poolFloor";
      draft.gameState.playerHeight = "one";
    });
    const result = runPoolTriggers(moveFailurePayload);
    expect(result.gameState.storyLine.at(-1)).toContain("can't fit");
    expect(result.gameState.success).toBe(false);
    expect(result.gameState.feedback).toBe("wrong playerHeight");
    expect(result.aborted).toBe(true);
  });

  it("returns payload unchanged for unrelated commands", () => {
    const unrelatedPayload = produce(initialCommandPayload, (draft) => {
      draft.command = "drink";
      draft.target = "bath";
      draft.gameState.currentRoom = "poolFloor";
    });

    const result = runPoolTriggers(unrelatedPayload);
    expect(result.gameState.feedback).toBe("no triggers fired");
    expect(result.gameState.success).toBe(false);
  });
});
