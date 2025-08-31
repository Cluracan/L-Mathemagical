import { useEffect, useRef } from "react";

import { useGameStore } from "../../store/useGameStore";
import { Mapper } from "./mapper";

export const Canvas = ({
  mapperRef,
  readyForCommandRef,
  processInputQueue,
}: {
  mapperRef: React.RefObject<Mapper | null>;
  readyForCommandRef: React.RefObject<boolean>;
  processInputQueue: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);

  const { currentRoom, visitedRooms } = useGameStore();

  useEffect(() => {
    console.log("redraw");
    if (!canvasRef.current) return;
    contextRef.current = canvasRef.current.getContext("2d");
    if (!contextRef.current) return;
    mapperRef.current = new Mapper(contextRef.current, 600, 600, currentRoom);
    if (!mapperRef.current) return;
    mapperRef.current.buildDrawableRooms(currentRoom, visitedRooms);
    mapperRef.current.renderMap(mapperRef.current.drawableRooms);
  }, []);

  useEffect(() => {
    if (!mapperRef.current) return;
    console.log("Starting animation in useEffect");
    mapperRef.current.moveToRoom(currentRoom, visitedRooms).then((res) => {
      console.log(res);
      console.log(
        `finished animation in useeffect ready: ${readyForCommandRef.current}`
      );
      readyForCommandRef.current = true;
      console.log(`set ready ${readyForCommandRef.current}`);
      processInputQueue();
    });
  }, [currentRoom]);

  return (
    <>
      {/* <p>{mapperRef.current?.isAnimating() ? "animating" : "still"}</p> */}
      <canvas ref={canvasRef} width={"600px"} height={"600px"} />
    </>
  );
};
