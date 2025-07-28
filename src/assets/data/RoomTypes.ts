import type { RoomId } from "./RoomId";

export type ExitDirection =
  | "N"
  | "E"
  | "S"
  | "W"
  | "U"
  | "D"
  | "IN"
  | "OUT"
  | "NE"
  | "NW"
  | "SE"
  | "SW";

export type Room = {
  id: RoomId;
  descriptions: Record<"long" | "short", string>;
  mapText: string;
  exits: Partial<Record<ExitDirection, RoomId>>;
};

export type { RoomId };
