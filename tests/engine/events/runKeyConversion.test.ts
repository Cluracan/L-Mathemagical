import { it, expect } from "vitest";
import { runKeyConversion } from "../../../src/engine/events/runKeyConversion";
import { produce } from "immer";
import { initialPipelinePayload } from "../../data/initialPipelinePayload";

const basePayload = {
  command: "get",
  target: "key",
  gameState: {
    itemLocation: { iron: "hallway", rusty: "player" },
    currentRoom: "hallway",
    storyLine: [],
  },
};

it("converts 'key' to a specific key in the room for 'get'", () => {
  const getKeyPayload = produce(initialPipelinePayload, (draft) => {
    draft.command = "get";
    draft.target = "key";
    draft.gameState.currentRoom = "grass";
    draft.gameState.itemLocation.iron = "grass";
  });
  const result = runKeyConversion(getKeyPayload);
  expect(result.target).toBe("iron");
});

it("converts 'key' to a specific key on player for 'drop'", () => {
  const dropKeyPayload = produce(initialPipelinePayload, (draft) => {
    draft.command = "drop";
    draft.target = "key";
    draft.gameState.currentRoom = "pit";
    draft.gameState.itemLocation.rusty = "player";
  });

  const result = runKeyConversion(dropKeyPayload);
  expect(result.target).toBe("rusty");
});

it("adds a message for 'drink' command", () => {
  const drinkKeyPayload = produce(initialPipelinePayload, (draft) => {
    draft.command = "drink";
    draft.target = "key";
    draft.gameState.itemLocation.rusty = "player";
  });
  const result = runKeyConversion(drinkKeyPayload);
  expect(result.gameState.storyLine.at(-1)).toContain("Drinking a key");
});
