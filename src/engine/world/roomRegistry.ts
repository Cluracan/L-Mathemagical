import { roomData } from "../../assets/data/roomData";
import type { Room, RoomId, ExitDirection } from "../../assets/data/roomData";

class RoomRegistry {
  private roomData: Record<RoomId, Room> = roomData;

  getLongDescription(id: RoomId) {
    return this.roomData[id].descriptions.long;
  }

  getShortDescription(id: RoomId) {
    return this.roomData[id].descriptions.short;
  }

  getExitDirections(id: RoomId) {
    return Object.keys(this.roomData[id].exits);
  }

  getExits(id: RoomId) {
    return this.roomData[id].exits;
  }

  hasExit(id: RoomId, direction: ExitDirection): boolean {
    return Object.keys(this.roomData[id].exits).includes(direction);
  }

  getExitDestination(id: RoomId, direction: ExitDirection): RoomId | null {
    const exitMap = this.roomData[id].exits;
    const nextRoom = exitMap[direction];
    return nextRoom || null;
  }
}

export const roomRegistry = new RoomRegistry();
