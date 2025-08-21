import { itemData } from "../../assets/data/itemData";
import type { Item, ItemId } from "../../assets/data/itemData";

class ItemRegistry {
  private itemData: Record<ItemId, Item> = itemData;

  getFloorDescription(id: ItemId) {
    return this.itemData[id].descriptions.floor;
  }
  getInventoryDescription(id: ItemId) {
    return this.itemData[id].descriptions.inventory;
  }
  getPickUpDescription(id: ItemId) {
    return `You pick up the ${this.itemData[id].descriptions.pickUp}`;
  }
  getDropDescription(id: ItemId) {
    return `You drop the ${this.itemData[id].descriptions.pickUp}`;
  }
  getExamineDescription(id: ItemId) {
    return this.itemData[id].descriptions.examine;
  }
  isDrinkable(id: ItemId) {
    return this.itemData[id].isDrinkable;
  }
}

export const itemRegistry = new ItemRegistry();
