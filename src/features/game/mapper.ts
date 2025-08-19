import {
  blockedExitData,
  isBlockedRoom,
} from "../../assets/data/blockedExitData";
import {
  roomData,
  type ExitDirection,
  type RoomId,
} from "../../assets/data/roomData";
import { useGameStore } from "../../store/useGameStore";
import { createKeyGuard } from "../../utils/guards";

//config Values
const roomSize = 50;
const userSize = 6;
const userColor = "#f4e22e";
const roomConnectorLength = 20;
const stairLength = 4;
const roomFont = "8pt Arial";
const animationTime = 800;

//calculated Values
const roomShift = roomConnectorLength / 2 + roomSize;

//types
type ExitInfo = { direction: string; blocked: boolean }[];
//helper functions

const nextRoomOffsets = {
  n: { dx: 0, dy: -1 },
  e: { dx: 1, dy: 0 },
  s: { dx: 0, dy: 1 },
  w: { dx: -1, dy: 0 },
  ne: { dx: 1, dy: -1 },
  se: { dx: 1, dy: 1 },
  sw: { dx: -1, dy: 1 },
  nw: { dx: -1, dy: -1 },
} as const satisfies Record<string, { dx: number; dy: number }>;

type CompassDirection = keyof typeof nextRoomOffsets;
const isCompassDirection = createKeyGuard(nextRoomOffsets);

const scaledOffset = (direction: CompassDirection, factor: number) => {
  const { dx, dy } = nextRoomOffsets[direction];
  return {
    dx: dx * factor,
    dy: dy * factor,
  };
};

const getNextRoomPosition = (
  x: number,
  y: number,
  roomDirection: CompassDirection
) => {
  const { dx, dy } = scaledOffset(roomDirection, roomShift);
  return { x: x + dx, y: y + dy };
};

const getExitPosition = (
  x: number,
  y: number,
  exitDirection: CompassDirection
) => {
  const exitStartOffsets: Record<
    CompassDirection,
    { xStart: number; yStart: number }
  > = {
    n: { xStart: x + roomSize / 2, yStart: y + roomConnectorLength / 4 },

    s: {
      xStart: x + roomSize / 2,
      yStart: y + roomSize - roomConnectorLength / 4,
    },

    e: {
      xStart: x + roomSize - roomConnectorLength / 4,
      yStart: y + roomSize / 2,
    },

    w: { xStart: x + roomConnectorLength / 4, yStart: y + roomSize / 2 },

    ne: {
      xStart: x + roomSize - roomConnectorLength / 4,
      yStart: y + roomConnectorLength / 4,
    },

    se: {
      xStart: x + roomSize - roomConnectorLength / 4,
      yStart: y + roomSize - roomConnectorLength / 4,
    },

    sw: {
      xStart: x + roomConnectorLength / 4,
      yStart: y + roomSize - roomConnectorLength / 4,
    },

    nw: {
      xStart: x + roomConnectorLength / 4,
      yStart: y + roomConnectorLength / 4,
    },
  };
  const { xStart, yStart } = exitStartOffsets[exitDirection];
  const { dx, dy } = scaledOffset(exitDirection, roomConnectorLength);
  return { xStart, yStart, xEnd: xStart + dx, yEnd: yStart + dy };
};

//TODO RENAME getRoomAdjustment   and maybe alter stepDistance to roomDisplacement or roomShift or shiftDistance? It's calculated as a translation amount in request animation so is a proportion of full translation
//ALSO TODO - rework nextRoomOffsets and use it here too! ALTHOUGH NOTE AND SORT THE OPPOSITE SIGNS!
const findRoomAdjustment = (
  roomDirection: ExitDirection,
  stepDistance: number
) => {
  switch (roomDirection) {
    case "n":
      return { x: 0, y: +stepDistance };
    case "e":
      return { x: -stepDistance, y: 0 };
    case "s":
      return { x: 0, y: -stepDistance };
    case "w":
      return { x: stepDistance, y: 0 };
    case "ne":
      return { x: -stepDistance, y: stepDistance };
    case "se":
      return { x: -stepDistance, y: -stepDistance };
    case "sw":
      return { x: stepDistance, y: -stepDistance };
    case "nw":
      return { x: stepDistance, y: stepDistance };
  }
};

const isWalkable = (direction: ExitDirection) => {
  return ["n", "e", "s", "w", "ne", "nw", "se", "sw"].includes(direction);
};

type DrawableRoom = { roomId: RoomId; x: number; y: number };

export class Mapper {
  private ctx;
  private width;
  private height;
  private currentRoomId;
  private centerRoomX;
  private centerRoomY;
  public drawableRooms: DrawableRoom[];
  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    currentRoomId: RoomId
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.currentRoomId = currentRoomId;
    this.centerRoomX = this.width / 2 - roomSize / 2;
    this.centerRoomY = this.height / 2 - roomSize / 2;
    this.drawableRooms = [];
  }
  clearCanvas() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  buildDrawableRooms(centerRoomId: RoomId, visitedRooms: RoomId[]) {
    // DFS traverse connected rooms(ignore stairs) pop() is O(1) whilst shift() is O(n) (reindex remaining elements)
    this.drawableRooms = [];
    const stack: DrawableRoom[] = [];
    //DFS = stack, BFS = queue (thanks chatGBT!)
    stack.push({
      roomId: centerRoomId,
      x: this.centerRoomX,
      y: this.centerRoomY,
    });
    while (stack.length > 0) {
      const curRoom: DrawableRoom = stack.pop()!;
      const curRoomId = curRoom.roomId;
      const curRoomX = curRoom.x;
      const curRoomY = curRoom.y;
      if (!this.drawableRooms.some((entry) => entry.roomId === curRoomId)) {
        this.drawableRooms.push(curRoom);
      }
      for (const [direction, nextRoomId] of Object.entries(
        roomData[curRoomId].exits
      )) {
        if (
          visitedRooms.includes(nextRoomId) &&
          isCompassDirection(direction) &&
          !this.drawableRooms.some((entry) => entry.roomId === nextRoomId)
        ) {
          const nextRoomPosition = getNextRoomPosition(
            curRoomX,
            curRoomY,
            direction
          );
          const nextRoom = {
            roomId: nextRoomId,
            x: nextRoomPosition.x,
            y: nextRoomPosition.y,
          }; //could use ...nextRoomPosition
          this.drawableRooms.push(nextRoom);
          stack.push(nextRoom);
        }
      }
    }
  }

  renderMap() {
    const drawableRooms = this.drawableRooms;
    this.clearCanvas();
    drawableRooms.forEach((room) => {
      this.renderRoom(room);
      this.renderExits(room);
    });
    this.renderUser();
  }

  renderRoom(room: DrawableRoom) {
    const roomName = roomData[room.roomId].mapText;
    this.ctx.fillStyle = "black";
    this.ctx.strokeStyle = "black";
    this.ctx.beginPath();
    this.ctx.roundRect(room.x, room.y, roomSize, roomSize, 3);
    this.ctx.stroke();
    this.ctx.font = roomFont;
    this.ctx.textAlign = "center";
    this.ctx.fillText(roomName, room.x + roomSize / 2, room.y + roomSize / 3);
  }

  getRoomExits(roomId: RoomId) {
    const possibleExits = Object.keys(roomData[roomId].exits);
    //no blocked exits
    if (!isBlockedRoom(roomId)) {
      return possibleExits.map((exitDirection) => ({
        direction: exitDirection,
        blocked: false,
      }));
    }
    const { keyLocked } = useGameStore.getState();
    //unlocked door
    if (
      blockedExitData[roomId].keyRequired &&
      !keyLocked[blockedExitData[roomId].keyRequired]
    )
      return possibleExits.map((exitDirection) => ({
        direction: exitDirection,
        blocked: false,
      }));
    //locked door
    const blockedExits: string[] = blockedExitData[roomId].direction;
    return possibleExits.map((exitDirection) => ({
      direction: exitDirection,
      blocked: blockedExits.includes(exitDirection),
    }));
  }

  renderCompassExits(room: DrawableRoom, exits: ExitInfo) {
    for (const exit of exits) {
      if (!isCompassDirection(exit.direction)) continue;
      const exitPosition = getExitPosition(room.x, room.y, exit.direction);
      this.ctx.strokeStyle = exit.blocked ? "red" : "black";
      this.ctx.beginPath();
      this.ctx.moveTo(exitPosition.xStart, exitPosition.yStart);
      this.ctx.lineTo(exitPosition.xEnd, exitPosition.yEnd);
      this.ctx.stroke();
    }
  }

  renderStairs(room: DrawableRoom, exits: ExitInfo) {
    for (const exit of exits) {
      if (["u", "d"].includes(exit.direction)) {
        this.ctx.beginPath();
        const stairXstart = room.x + roomSize / 2 - 1.5 * stairLength;
        const stairYstart = room.y + roomSize / 2 + 3 * stairLength;
        this.ctx.moveTo(stairXstart, stairYstart);
        this.ctx.lineTo(stairXstart, stairYstart - stairLength);
        this.ctx.lineTo(stairXstart + stairLength, stairYstart - stairLength);
        this.ctx.lineTo(
          stairXstart + stairLength,
          stairYstart - 2 * stairLength
        );
        this.ctx.lineTo(
          stairXstart + 2 * stairLength,
          stairYstart - 2 * stairLength
        );
        this.ctx.lineTo(
          stairXstart + 2 * stairLength,
          stairYstart - 3 * stairLength
        );
        this.ctx.lineTo(
          stairXstart + 3 * stairLength,
          stairYstart - 3 * stairLength
        );
        this.ctx.stroke();
      }
    }
  }

  renderExits(room: DrawableRoom) {
    const exits = this.getRoomExits(room.roomId);
    this.renderCompassExits(room, exits);
    this.renderStairs(room, exits);
  }

  renderUser() {
    this.ctx.strokeStyle = "black";
    this.ctx.fillStyle = userColor;
    this.ctx.beginPath();
    this.ctx.arc(
      this.centerRoomX + roomSize / 2,
      this.centerRoomY + 0.6 * roomSize,
      userSize,
      0,
      2 * Math.PI
    );
    this.ctx.stroke();
    this.ctx.fill();
  }

  moveToRoom(targetToom: RoomId, visitedRooms: RoomId[]) {}
}
