import { describe, it, expect } from "vitest";
import {
  runBathTriggers,
  bathFeedback,
} from "../../../src/engine/events/runBathTriggers";
import { initialPipelinePayload } from "../../data/initialPipelinePayload";
import { produce } from "immer";
import type { PipelinePayload } from "../../../src/engine/actions/dispatchCommand";

const lookBathPayload: PipelinePayload = produce(
  initialPipelinePayload,
  (draft) => {
    draft.command = "look";
    draft.target = "bath";
    draft.gameState.currentRoom = "riverS";
  }
);

describe("runBathTriggers", () => {
  it("describes bath when looking", () => {
    const result = runBathTriggers(lookBathPayload);
    expect(result.gameState.storyLine.at(-1)).toContain("The bath");
    expect(result.done).toBe(true);
  });

  it("prevents moving across river if bath not sealed", () => {
    const movePayload: PipelinePayload = produce(
      initialPipelinePayload,
      (draft) => {
        draft.command = "move";
        draft.target = "n";
        draft.gameState.currentRoom = "riverS";
      }
    );

    const result = runBathTriggers(movePayload);
    expect(result.gameState.storyLine.at(-1)).toContain(
      "How are you going to cross the river?"
    );
    expect(result.gameState.success).toBe(false);
    expect(result.done).toBe(true);
  });

  it("prevents moving if no oar", () => {
    const noOarPayload: PipelinePayload = produce(
      initialPipelinePayload,
      (draft) => {
        draft.command = "use";
        draft.target = "bath";
        draft.gameState.currentRoom = "riverS";
        draft.gameState.bathState = {
          cube: true,
          tetrahedron: true,
          icosahedron: true,
          octahedron: true,
          dodecahedron: true,
        };
      }
    );

    const result = runBathTriggers(noOarPayload);
    expect(result.gameState.storyLine.at(-1)).toContain("without an oar");
  });

  it("succeeds if bath sealed, player has oar, and not overloaded", () => {
    const successPayload: PipelinePayload = produce(
      initialPipelinePayload,
      (draft) => {
        draft.command = "use";
        draft.target = "bath";
        draft.gameState.bathState = {
          cube: true,
          tetrahedron: true,
          icosahedron: true,
          octahedron: true,
          dodecahedron: true,
        };
        draft.gameState.itemLocation.oar = "player";
        draft.gameState.currentRoom = "riverS";
      }
    );

    const result = runBathTriggers(successPayload);
    expect(result.gameState.storyLine.at(-1)).toContain("safely across");
    expect(result.gameState.currentRoom).toBe("riverN");
  });
});

// Edge case: unrelated command
it("returns payload unchanged for unrelated commands", () => {
  const payload = produce(initialPipelinePayload, (draft) => {
    draft.command = "drink";
    draft.target = "bath";
  });
  const result = runBathTriggers(payload);
  expect(result).toEqual(payload);
});

// Edge case: not at river
it("returns payload unchanged if not at river", () => {
  const payload = produce(initialPipelinePayload, (draft) => {
    draft.gameState.currentRoom = "hallway";
  });
  const result = runBathTriggers(payload);
  expect(result).toEqual(payload);
});

// Edge case: player is overloaded
it("prevents moving if player is overloaded", () => {
  const payload = produce(initialPipelinePayload, (draft) => {
    draft.command = "use";
    draft.target = "bath";
    draft.gameState.bathState = {
      cube: true,
      tetrahedron: true,
      icosahedron: true,
      octahedron: true,
      dodecahedron: true,
    };
    draft.gameState.itemLocation.oar = "player";
    draft.gameState.itemLocation.cube = "player";
    draft.gameState.currentRoom = "riverS";
  });
  const result = runBathTriggers(payload);
  expect(result.gameState.storyLine.at(-1)).toContain(
    "The bath won't carry that much weight"
  );
  expect(result.done).toBe(true);
});

// Edge case: bath not sealed
it("prevents moving if bath is not sealed", () => {
  const payload = produce(initialPipelinePayload, (draft) => {
    draft.command = "use";
    draft.target = "bath";
    draft.gameState.bathState = {
      cube: false,
      tetrahedron: false,
      icosahedron: false,
      octahedron: false,
      dodecahedron: false,
    };
    draft.gameState.itemLocation.oar = "player";
    draft.gameState.currentRoom = "riverS";
  });
  const result = runBathTriggers(payload);
  expect(result.gameState.storyLine.at(-1)).toContain("won't float");
  expect(result.done).toBe(true);
});

// Edge case: player does not have oar
it("prevents moving if player does not have oar", () => {
  const payload = produce(initialPipelinePayload, (draft) => {
    draft.command = "use";
    draft.target = "bath";
    draft.gameState.bathState = {
      cube: true,
      tetrahedron: true,
      icosahedron: true,
      octahedron: true,
      dodecahedron: true,
    };
    draft.gameState.currentRoom = "riverS";
  });
  const result = runBathTriggers(payload);
  expect(result.gameState.storyLine.at(-1)).toBe(bathFeedback.noOar);
  expect(result.done).toBe(true);
});
