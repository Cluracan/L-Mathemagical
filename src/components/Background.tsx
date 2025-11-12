import { Box } from "@mui/material";
import { useEffect, type PropsWithChildren } from "react";

interface BackgroundProps extends PropsWithChildren {
  src: string;
}
export const Background = ({ src, children }: BackgroundProps) => {
  useEffect(() => {
    const img = new Image();
    img.src = src;
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "inset 0 0 10vh rgba(0,0,0,0.8)",
      }}
    >
      {children}
    </Box>
  );
};
