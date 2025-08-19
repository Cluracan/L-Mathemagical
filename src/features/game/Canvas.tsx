import { useEffect, useRef } from "react";
import { Mapper } from "./mapper";
import { useGameStore } from "../../store/useGameStore";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const mapperRef = useRef<Mapper | null>(null);

  const { currentRoom, visitedRooms } = useGameStore();

  useEffect(() => {
    if (!canvasRef.current) return;
    contextRef.current = canvasRef.current.getContext("2d");
    if (!contextRef.current) return;
    mapperRef.current = new Mapper(contextRef.current, 600, 600, currentRoom);
    if (!mapperRef.current) return;
    mapperRef.current.buildDrawableRooms(currentRoom, visitedRooms);
    mapperRef.current.renderMap();
  }, []);

  return (
    <>
      <canvas ref={canvasRef} width={"600px"} height={"600px"} />
    </>
  );
};
