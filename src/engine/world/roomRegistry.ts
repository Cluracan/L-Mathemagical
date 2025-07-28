import { readFileSync } from "fs";
import type { RoomId, Room } from "../../assets/data/RoomTypes";

const rooms: Record<RoomId, Room> = JSON.parse(
  readFileSync("../assets/data/rooms.json", "utf8")
);

class RoomRegistry {
  private rooms: Record<RoomId, Room> = rooms;

  getLongDescription(id: RoomId) {
    return this.rooms[id].descriptions.long;
  }

  getShortDescription(id: RoomId) {
    return this.rooms[id].descriptions.short;
  }

  getExitDirections(id: RoomId) {
    return Object.keys(this.rooms[id].exits);
  }

  getExits(id: RoomId) {
    return this.rooms[id].exits;
  }

  hasExit(id: RoomId, direction: string): boolean {
    return Object.keys(this.rooms[id].exits).includes(direction);
  }

  getExitDestination(id: RoomId, direction: string): RoomId | undefined {
    const exitMap = this.rooms[id].exits;
    if (direction in exitMap) {
      const newRoomId = exitMap[direction as keyof typeof exitMap];
      return newRoomId;
    }
  }
}

export const roomRegistry = new RoomRegistry();
