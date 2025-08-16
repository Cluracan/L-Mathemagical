import type { ItemId } from "./itemData";
import { type ExitDirection, type RoomId } from "./roomData";

export const blockedExitData = {
  //Key available
  file: {
    direction: "E",
    lockedText:
      "You cannot go through the oak door because it is locked.\n\nThe door has four large keyholes.",
    keyRequired: "iron",
  },
  panelled: {
    direction: "W",
    lockedText: "The west door seems to be locked from the other side.",
    keyRequired: "iron",
  },
  granite: {
    direction: "S",
    lockedText: "The door is securely locked",
    keyRequired: "rusty",
  },
  woodenStairs: {
    direction: "N",
    lockedText: "The door is securely locked",
    keyRequired: "rusty",
  },
  //Permanently locked
  hallway: {
    direction: "S",
    lockedText: "The outside door seems to have jammed. You can't get it open.",
    keyRequired: null,
  },
  lobby: {
    direction: "S",
    lockedText: "The door is securely locked.",
    keyRequired: null,
  },
  mirror: {
    direction: "W",
    lockedText:
      "As you move, everyone else in the corridor moves too. Before you are half way to the west door, you bump into a cold flat surface which is impossible to pass.",
    keyRequired: null,
  },
  cellar01: {
    direction: "W",
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar02: {
    direction: "N",
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar03: {
    direction: "N",
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar04: {
    direction: "W",
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar05: {
    direction: "S",
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar07: {
    direction: "W",
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar08: {
    direction: "E",
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar09: {
    direction: "W",
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar10: {
    direction: "S",
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar11: {
    direction: "W",
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
  cellar12: {
    direction: "W",
    lockedText:
      "When you open this door you find a brick wall immediately behind it.",
    keyRequired: null,
  },
} as const satisfies Partial<
  Record<
    RoomId,
    { direction: ExitDirection; lockedText: string; keyRequired: ItemId | null }
  >
>;

export const initialKeyLocked: Partial<Record<ItemId, boolean>> = {
  iron: true,
  rusty: true,
};
