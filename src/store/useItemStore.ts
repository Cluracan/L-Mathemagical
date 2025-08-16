import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ItemId } from "../engine/world/itemRegistry";
import type { RoomId } from "../assets/data/RoomId";
import items from "../assets/data/itemData";

type ItemStoreState = { locationMap: Record<ItemId, RoomId> };
type ItemStoreActions = {
  //   getItemsAt: (roomId: RoomId) => ItemId[];
  setItemLocation: (item: ItemId, location: RoomId) => void;
};
type ItemStore = ItemStoreState & ItemStoreActions;

const initialItemState = Object.values(items).reduce(
  (obj, item) => Object.assign(obj, { [item.id]: item.initialLocation }),
  {}
) as Record<ItemId, RoomId>;

export const useItemStore = create<ItemStore>()(
  persist(
    (set) => ({
      locationMap: { ...initialItemState },
      setItemLocation: (item, location) =>
        set((state) => ({
          locationMap: Object.assign(state.locationMap, { [item]: location }),
        })),
    }),
    {
      name: "l-item-storage",
    }
  )
);
