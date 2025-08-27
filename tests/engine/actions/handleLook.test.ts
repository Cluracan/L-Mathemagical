import { it, expect } from "vitest";
import { handleLook } from "../../../src/engine/actions/handleLook";
import { initialGameState } from "../../data/initialGameState";
import { produce } from "immer";

it("adds long description for first visit", () => {
  const result = handleLook({
    command: "look",
    target: null,
    gameState: initialGameState,
  });
  expect(result.storyLine.length).toBeGreaterThan(0);
});

it("adds short description for revisited room", () => {
  const revisitedGameState = produce(initialGameState, (draft) => {
    draft.visitedRooms = new Set(["grass"]);
  });
  const result = handleLook({
    command: "look",
    target: null,
    gameState: revisitedGameState,
  });
  expect(result.storyLine.length).toBeGreaterThan(0);
});
