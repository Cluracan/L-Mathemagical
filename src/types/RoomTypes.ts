import type { RoomId } from "./RoomId";

export type Exit = "N" | "E" | "S" | "W" | "U" | "D" | "IN" | "OUT";

export type Room = {
  id: RoomId;
  longDescription: string;
  shortDescription: string;
  mapText: string;
  exits: Partial<Record<Exit, RoomId>>;
};
