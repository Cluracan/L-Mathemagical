import { it, expect } from "vitest";
import { handleMove } from "../../../src/engine/actions/handleMove";
import { initialGameState } from "../../data/initialGameState";

it("returns failure if direction is invalid", () => {
  const result = handleMove({
    command: "move",
    target: "banana",
    gameState: initialGameState,
  });
  expect(result.success).toBe(false);
});

it("moves player to next room if valid", () => {
  const result = handleMove({
    command: "move",
    target: "north",
    gameState: initialGameState,
  });
  expect(result.currentRoom).toBe("hallway");
  expect(result.stepCount).toBeGreaterThan(0);
});
