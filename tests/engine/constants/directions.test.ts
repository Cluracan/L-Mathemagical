import { describe, it, expect } from "vitest";
import {
  directionAliases,
  directionNarratives,
  isDirectionAlias,
} from "../../../src/engine/constants/directions";

describe("directionAliases", () => {
  it("maps words to canonical directions", () => {
    expect(directionAliases["north"]).toBe("n");
    expect(directionAliases["s"]).toBe("s");
    expect(directionAliases["down"]).toBe("d");
  });

  it("rejects non-directions", () => {
    expect(isDirectionAlias("banana")).toBe(false);
  });

  it("accepts valid directions", () => {
    expect(isDirectionAlias("ne")).toBe(true);
  });
});

describe("directionNarratives", () => {
  it("provides readable text for directions", () => {
    expect(directionNarratives["n"]).toBe("north");
    expect(directionNarratives["sw"]).toBe("south-west");
  });
});
