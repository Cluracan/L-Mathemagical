import { useEffect, useRef } from "react";
import { useGameStore } from "../../store/useGameStore";
import { Mapper } from "./mapper";
import { useWindowDimensions } from "../hooks/useWindowDimensions";

const CANVAS_WIDTH_RATIO = 0.2;

export const Canvas = ({
  reportAnimationComplete,
}: {
  reportAnimationComplete: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const mapperRef = useRef<Mapper | null>(null);
  const { width } = useWindowDimensions();
  const canvasWidth = CANVAS_WIDTH_RATIO * width;
  const currentRoom = useGameStore((state) => state.currentRoom);
  const visitedRooms = useGameStore((state) => state.visitedRooms);
  useEffect(() => {
    if (!canvasRef.current) return;
    contextRef.current = canvasRef.current.getContext("2d");
    if (!contextRef.current) return;
    mapperRef.current = new Mapper(
      contextRef.current,
      canvasWidth,
      canvasWidth,
      currentRoom
    );
    if (!mapperRef.current) return;
    mapperRef.current.buildDrawableRooms(currentRoom, visitedRooms);
    mapperRef.current.renderMap(mapperRef.current.drawableRooms);
  }, [width]);

  useEffect(() => {
    if (!mapperRef.current) return;
    mapperRef.current.moveToRoom(currentRoom, visitedRooms).then(() => {
      reportAnimationComplete();
    });
  }, [currentRoom]);

  return (
    <>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasWidth} />
    </>
  );
};
