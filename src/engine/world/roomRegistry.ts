import { readFileSync } from "fs";
import type { RoomId, Room, ExitDirection } from "../../assets/data/RoomTypes";

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

  hasExit(id: RoomId, direction: ExitDirection): boolean {
    return Object.keys(this.rooms[id].exits).includes(direction);
  }

  getExitDestination(id: RoomId, direction: ExitDirection): RoomId | undefined {
    if (this.hasExit(id, direction)) {
      return this.rooms[id].exits[direction];
    }
  }
}

export const roomRegistry = new RoomRegistry();
