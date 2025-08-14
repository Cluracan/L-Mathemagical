import { describe, it, expect } from "vitest";
import { parseInput } from "./parseInput";

describe("parseInput", () => {
  it("parses a MOVE command by direction word", () => {
    expect(parseInput("NORTH")).toEqual({ command: "MOVE", keyWord: "N" });
    expect(parseInput("east")).toEqual({ command: "MOVE", keyWord: "E" });
  });

  it("parses a GET command with an item", () => {
    expect(parseInput("GET ring")).toEqual({ command: "GET", keyWord: "RING" });
    expect(parseInput("TAKE cube")).toEqual({
      command: "GET",
      keyWord: "CUBE",
    });
  });

  it("parses a DROP command with an item", () => {
    expect(parseInput("DROP ring")).toEqual({
      command: "DROP",
      keyWord: "RING",
    });
    expect(parseInput("THROW stone")).toEqual({
      command: "DROP",
      keyWord: "STONE",
    });
  });

  it("parses an INVENTORY command", () => {
    expect(parseInput("inv")).toEqual({ command: "INVENTORY", keyWord: "INV" });
  });

  it("returns null for unknown input", () => {
    expect(parseInput("BARK LOUDLY")).toEqual({
      command: null,
      keyWord: "LOUDLY",
    });
  });

  it("trims and parses with extra whitespace", () => {
    expect(parseInput("  get    torch  ")).toEqual({
      command: "GET",
      keyWord: "TORCH",
    });
  });
});
