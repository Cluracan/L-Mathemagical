import { createKeyGuard } from "../../utils/guards";
import type { RoomId } from "./roomData";

export const itemData = {
  tetrahedron: {
    id: "tetrahedron",
    initialLocation: "workshop",
    descriptions: {
      floor:
        "Lying on the ground is a small tetrahedron, made of solid platinum.",
      inventory: "A platinum tetrahedron",
      pickUp: "platinum tetrahedron",
      examine:
        "The tetrahedron looks very solid - perhaps you can find a use for it?",
    },
    isDrinkable: false,
  },
  cube: {
    id: "cube",
    initialLocation: "cupboard",
    descriptions: {
      floor: "A golden cube is lying on the ground here",
      inventory: "A gold cube",
      pickUp: "gold cube",
      examine: "The cube is small, but made of solid gold.",
    },
    isDrinkable: false,
  },
  dodecahedron: {
    id: "dodecahedron",
    initialLocation: "oriental",
    descriptions: {
      floor: "Here is a dodecahedron made from an enormous diamond.",
      inventory: "a diamond dodecahedron",
      pickUp: "diamond dodecahedron",
      examine: "This diamond has 12 identical faces that glitter in the light.",
    },
    isDrinkable: false,
  },
  icosahedron: {
    id: "icosahedron",
    initialLocation: "pit",
    descriptions: {
      floor: "On the ground is an icosahedron made of polished jade.",
      inventory: "A jade icosahedron",
      pickUp: "jade icosahedron",
      examine:
        "This gemstone has swirling patterns of various shades of green on each of its 20 faces.",
    },
    isDrinkable: false,
  },
  octahedron: {
    id: "octahedron",
    initialLocation: "panelled",
    descriptions: {
      floor: "There is an octahedron made of ivory here.",
      inventory: "An ivory octahedron",
      pickUp: "ivory octahedron",
      examine:
        "The octahedron is discoloured by age, but still feels very solid in your hand.",
    },
    isDrinkable: false,
  },
  bottle: {
    id: "bottle",
    initialLocation: "pit",
    descriptions: {
      floor:
        "On the ground is  a small medicine bottle, containing a blue liquid. On the label is printed 'x 1.25'.",
      inventory: "A bottle labelled 'x 1.25'",
      pickUp: "medicine bottle",
      examine:
        "The bottle contains a sweet-smelling blue liquid. It seems very drinkable...",
    },
    isDrinkable: true,
    heightMultiplier: 1.25,
    drinkMessage: {
      "1": "You experience a very strange sensation as if all the molecules in your body are rearranging themselves. You feel as if you are being opened up like a retractable aerial. You have grown to five-fourths of your normal size.\n\nThe bottle vanishes into thin air as you drink the last sip.",
      "0.6":
        "You have grown a little. You are now three quarters of your original height.\n\nThe bottle has vanished.",
    },
  },
  phial: {
    id: "phial",
    initialLocation: "pit",
    descriptions: {
      floor:
        "On the ground is a phial of pink liquid. Attached to it by a string is a card which reads 'x 0.6'.",
      inventory: "A phial labelled 'x 0.6'",
      pickUp: "phial",
      examine:
        "The phial contains a pink liquid. You take a sniff, but can't quite place the scent - it seems to be a mix of cherry-tart, custard, pineapple, roast turkey, toffee, and hot buttered toast.",
    },
    isDrinkable: true,
    heightMultiplier: 0.6,
    drinkMessage: {
      "1": "You experience a very strange sensation as if all the molecules in your body are rearranging themselves. You feel as if you are being closed up like a retractable aerial. You have shrunk to three-fifths of your normal height.\n\nThe phial vanishes into thin air as you drink the last sip.",
      "1.25":
        "Now you are shrinking! You are now only three quarters of your original height.\n\nThe phial has vanished.",
    },
  },
  oar: {
    id: "oar",
    initialLocation: "pit",
    descriptions: {
      floor: "There is a wooden oar lying here.",
      inventory: "A wooden oar",
      pickUp: "wooden oar",
      examine:
        "This oar looks like it could help you if you ever needed to cross some water in a vessel (as long as you know how to single-oar scull!)",
    },
    isDrinkable: false,
  },
  sphere: {
    id: "sphere",
    initialLocation: "cellar05",
    descriptions: {
      floor: "On the ground is a perfect sphere made of polished steel.",
      inventory: "A steel sphere",
      pickUp: "steel sphere",
      examine:
        "The sphere is very heavy, and highly polished. You resist the temptation to kick it (it's heavy steel, remember?)",
    },
    isDrinkable: false,
  },
  rusty: {
    id: "rusty",
    initialLocation: "pit",
    descriptions: {
      floor: "There is a small rusty key lying here.",
      inventory: "A rusty key",
      pickUp: "rusty key",
      examine:
        "This key is tarnished by age, but could be very useful, if you find the right door...",
    },
    isDrinkable: false,
  },
  iron: {
    id: "iron",
    initialLocation: "pit",
    descriptions: {
      floor: "There is an odd-shaped iron key lying here.",
      inventory: "An iron key",
      pickUp: "iron key",
      examine: "This key has been carefully filed to fit multiple locks...",
    },
    isDrinkable: false,
  },
  spectacles: {
    id: "spectacles",
    initialLocation: "code",
    descriptions: {
      floor: "A pair of frail-looking spectacles is lying at your feet.",
      inventory: "A frail pair of spectacles",
      pickUp: "spectacles",
      examine: "The wire-rimmed spectacles have a magical air about them.",
    },
    isDrinkable: false,
  },
  ladder: {
    id: "ladder",
    initialLocation: "pit",
    descriptions: {
      floor: "There is a rope ladder here.",
      inventory: "A rope ladder",
      pickUp: "rope ladder",
      examine:
        "It's a ladder, made of rope. It could be used as an emergency escape...",
    },
    isDrinkable: false,
  },
  hair: {
    id: "hair",
    initialLocation: "landing",
    descriptions: {
      floor: "A long strand of red hair is lying on the ground.",
      inventory: "A strand of red hair",
      pickUp: "strand of hair",
      examine:
        "This hair doesn't look like it belongs to the abbot. Whose is it?",
    },
    isDrinkable: false,
  },
  ticket: {
    id: "ticket",
    initialLocation: "blue",
    descriptions: {
      floor:
        "An old bus ticket is lying on the ground. It seems to have something written on it.",
      inventory: "An old bus ticket",
      pickUp: "bus ticket",
      examine:
        "On the back of the bus ticket is written in spdery handwriting:-\n\nTHE COMBINATION IS A PERFECT SQUARE AND A PERFECT CUBE",
    },
    isDrinkable: false,
  },
  ring: {
    id: "ring",
    initialLocation: "pit",
    descriptions: {
      floor: "A gold ring glistens on the ground.",
      inventory: "A gold ring",
      pickUp: "gold ring",
      examine:
        "You sense that the ring holds huge magical powers. It feels strangely heavy in your hand.",
    },
    isDrinkable: false,
  },
} as const satisfies Record<
  string,
  {
    id: string;
    initialLocation: RoomId;
    descriptions: Record<"floor" | "inventory" | "pickUp" | "examine", string>;
    isDrinkable: boolean;
    heightMultiplier?: number;
    drinkMessage?: Partial<Record<"0.6" | "1" | "1.25", string>>;
  }
>;

export type ItemId = keyof typeof itemData;

export type Item = {
  id: ItemId;
  initialLocation: RoomId;
  descriptions: Record<"floor" | "inventory" | "pickUp" | "examine", string>;
  isDrinkable: boolean;
};

export const isItemId = createKeyGuard(itemData);

export const initialItemLocation = Object.values(itemData).reduce(
  (obj, item) => Object.assign(obj, { [item.id]: item.initialLocation }),
  {}
) as Partial<Record<ItemId, RoomId>>;

export const initialKeyLocked: Partial<Record<ItemId, boolean>> = {
  iron: true,
  rusty: true,
};

export const keyList = Object.keys(initialKeyLocked);

// const testItem: Record<ItemId, Item> = itemData;
