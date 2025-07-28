// import { expect, test, vi } from "vitest";
// import { handleMove } from "./handleMove";
// import type { GameState } from "../gameEngine";

// test("moves north if exit exists", () => {
//   const mockRoomRegistry = {
//     hasExit: vi.fn(() => true),
//     getExitDestination: vi.fn(() => "LIBRARY"),
//     getLongDescription: vi.fn(() => "You are in the library."),
//   };
//   const state: GameState = {
//     currentRoom: "hallway",
//     roomsVisited: new Set(["hallway"]),
//     stepCount: 5,
//     storyLine: [] as string[],
//   };

//   const result = handleMove({ keyWord: "NORTH", state });

//   expect(result.currentRoom).toBe("LIBRARY");
//   expect(result.storyLine).toContain("you travel north");
// });

//Test not working currently - moveRoomRegistry needs including? Or some redirect for readFileSync?
