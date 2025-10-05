import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface Dimensions {
  width: number;
  height: number;
}

export const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const debounced = useDebouncedCallback((dimensions: Dimensions) => {
    setDimensions(dimensions);
  }, 200);

  useEffect(() => {
    const handleResize = () => {
      debounced({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return dimensions;
};
