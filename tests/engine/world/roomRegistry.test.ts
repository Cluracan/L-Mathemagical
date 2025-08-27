import { describe, it, expect } from "vitest";
import { roomRegistry } from "../../../src/engine/world/roomRegistry";

describe("roomRegistry", () => {
  it("gets room descriptions", () => {
    const rooms = Object.keys((roomRegistry as any).roomData);
    expect(rooms.length).toBeGreaterThan(0);
    expect(roomRegistry.getLongDescription("grass")).toBeTypeOf("string");
    expect(roomRegistry.getShortDescription("grass")).toBeTypeOf("string");
  });

  it("checks exits", () => {
    const exits = roomRegistry.getExitDirections("grass");
    expect(Array.isArray(exits)).toBe(true);
  });
});
