import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type Dimensions = {
  width: number;
  height: number;
};

export const useWindowDimensions = () => {
  const dpr = window.devicePixelRatio || 1;
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth / dpr,
    height: window.innerHeight / dpr,
  });

  const debounced = useDebouncedCallback((dimensions: Dimensions) => {
    setDimensions(dimensions);
  }, 200);

  useEffect(() => {
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      debounced({
        width: window.innerWidth / dpr,
        height: window.innerHeight / dpr,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return dimensions;
};
