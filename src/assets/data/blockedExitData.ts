import { createKeyGuard } from "../../utils/guards";
import type { ItemId } from "./itemData";
import { type ExitDirection, type RoomId } from "./roomData";

export const blockedExitData = {
  // Key locked
  file: {
    direction: ["e"],
    lockedText:
      "You cannot go through the oak door because it is locked.\n\nThe door has four large keyholes.",
    keyRequired: "iron",
  },
  panelled: {
    direction: ["w"],
    lockedText: "The west door seems to be locked from the other side.",
    keyRequired: "iron",
  },
  granite: {
    direction: ["s"],
    lockedText: "The door is securely locked.",
    keyRequired: "rusty",
  },
  woodenStairs: {
    direction: ["n"],
    lockedText: "The door is securely locked.",
    keyRequired: "rusty",
  },
  safe: {
    direction: ["n"],
    lockedText: "The safe door is securely locked.",
    keyRequired: "safe",
  },
  carpetPassageS: {
    direction: ["s"],
    lockedText: "The safe door is securely locked.",
    keyRequired: "safe",
  },
  telephone: {
    direction: ["d"],
    lockedText: "You can't travel that way!",
    keyRequired: "chest",
  },
  attic: {
    direction: ["e"],
    lockedText: "The attic door is securely locked.",
    keyRequired: "jail",
  },
  atticPassage: {
    direction: ["w"],
    lockedText: "The attic door is securely locked.",
    keyRequired: "jail",
  },

  // Locked uniquely (handled separately in state)
  cell: {
    direction: ["d"],
    lockedText:
      "You take a look out of the window, and very quickly decide against attempting to climb down the smooth walls of the castle. If only there were another way to descend!",
    keyRequired: null,
  },

  // Permanently locked
  hallway: {
    direction: ["s"],
    lockedText: "The outside door seems to have jammed. You can't get it open.",
    keyRequired: null,
  },
  lobby: {
    direction: ["s"],
    lockedText: "The door is securely locked.",
    keyRequired: null,
  },
  mirror: {
    direction: ["w"],
    lockedText:
      "As you move, everyone else in the corridor moves too. Before you are half way to the west door, you bump into a cold flat surface which is impossible to pass.",
    keyRequired: null,
  },
  cellar01: {
    direction: ["n", "w"],
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar02: {
    direction: ["n"],
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar03: {
    direction: ["n"],
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar04: {
    direction: ["s", "w"],
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar05: {
    direction: ["s"],
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar07: {
    direction: ["e", "s", "w"],
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar08: {
    direction: ["e"],
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar09: {
    direction: ["n", "e", "w"],
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar10: {
    direction: ["e", "s"],
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar11: {
    direction: ["e", "w"],
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar12: {
    direction: ["e", "w"],
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
} as const satisfies Partial<Record<RoomId, BlockedExitData>>;
interface BlockedExitData {
  direction: ExitDirection[];
  lockedText: string;
  keyRequired: ItemId | null;
}
export const isBlockedRoom = createKeyGuard(blockedExitData);
