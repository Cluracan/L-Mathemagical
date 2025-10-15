import { itemData } from "../../assets/data/itemData";
import type { Item, ItemId, PlayerHeight } from "../../assets/data/itemData";

class ItemRegistry {
  private itemData: Record<ItemId, Item> = itemData;

  getFloorDescription(id: ItemId) {
    return this.itemData[id].descriptions.floor;
  }
  getInventoryDescription(id: ItemId) {
    return this.itemData[id].descriptions.inventory;
  }
  getItemName(id: ItemId) {
    return this.itemData[id].descriptions.pickUp;
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
  getDrinkMessage(id: ItemId, height: PlayerHeight) {
    if (!this.itemData[id].isDrinkable) {
      throw new Error(`Item ${id} is not drinkable`);
    }
    return this.itemData[id].drinkMessage[height];
  }
  getNewHeight(id: ItemId, height: PlayerHeight) {
    if (!this.itemData[id].isDrinkable) {
      throw new Error(`Item ${id} is not drinkable`);
    }
    return this.itemData[id].heightChange[height];
  }
}

export const itemRegistry = new ItemRegistry();
