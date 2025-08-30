import { it, expect } from "vitest";
import { handleDrop } from "../../../src/engine/actions/handleDrop";
import { initialGameState } from "../../data/initialGameState";
import { produce } from "immer";

it("returns failure if no target", () => {
  const result = handleDrop({
    command: "drop",
    target: null,
    gameState: initialGameState,
  });
  expect(result.success).toBe(false);
});

it("returns failure if item not on player", () => {
  const result = handleDrop({
    command: "drop",
    target: "ring",
    gameState: initialGameState,
  });
  expect(result.success).toBe(false);
});

it("drops item to current room if on player", () => {
  const itemOnPlayerGameState = produce(initialGameState, (draft) => {
    draft.itemLocation.rusty = "player";
    draft.currentRoom = "grass";
  });
  const result = handleDrop({
    command: "drop",
    target: "rusty",
    gameState: itemOnPlayerGameState,
  });
  expect(result.itemLocation.rusty).toBe("grass");
  expect(result.storyLine.length).toBeGreaterThan(0);
});
