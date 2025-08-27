import { describe, it, expect } from "vitest";
import { parseInput } from "../../../src/engine/parser/parseInput";

describe("parseInput", () => {
  it("parses movement commands via directions", () => {
    expect(parseInput("north")).toEqual({ command: "move", target: "n" });
    expect(parseInput("s")).toEqual({ command: "move", target: "s" });
    expect(parseInput("up")).toEqual({ command: "move", target: "u" });
  });

  it("parses item commands", () => {
    expect(parseInput("get ring")).toEqual({ command: "get", target: "ring" });
    expect(parseInput("take cube")).toEqual({ command: "get", target: "cube" });
    expect(parseInput("drop torch")).toEqual({
      command: "drop",
      target: "torch",
    });
    expect(parseInput("throw stone")).toEqual({
      command: "drop",
      target: "stone",
    });
  });

  it("parses utility commands", () => {
    expect(parseInput("look")).toEqual({ command: "look", target: null });
    expect(parseInput("inventory")).toEqual({
      command: "inventory",
      target: null,
    });
    expect(parseInput("inv")).toEqual({ command: "inventory", target: null });
  });

  it("handles unknown input", () => {
    expect(parseInput("dance wildly")).toEqual({
      command: null,
      target: "wildly",
    });
  });

  it("handles extra whitespace", () => {
    expect(parseInput("   get    ring   ")).toEqual({
      command: "get",
      target: "ring",
    });
  });
});
