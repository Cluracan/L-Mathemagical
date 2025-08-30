import { it, expect } from "vitest";
import { handleGet } from "../../../src/engine/actions/handleGet";
import { initialGameState } from "../../data/initialGameState";
import { produce } from "immer";

it("returns failure if no target", () => {
  const result = handleGet({
    command: "get",
    target: null,
    gameState: initialGameState,
  });
  expect(result.success).toBe(false);
});

it("returns failure if item not in current room", () => {
  const result = handleGet({
    command: "get",
    target: "ring",
    gameState: initialGameState,
  });
  expect(result.success).toBe(false);
});

it("adds item to player if present", () => {
  const itemPresentGameState = produce(initialGameState, (draft) => {
    draft.itemLocation.rusty = "grass";
  });
  const result = handleGet({
    command: "get",
    target: "rusty",
    gameState: itemPresentGameState,
  });
  expect(result.itemLocation.rusty).toBe("player");
  expect(result.storyLine.length).toBeGreaterThan(0);
});
