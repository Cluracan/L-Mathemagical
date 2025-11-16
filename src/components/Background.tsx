import { Box } from "@mui/material";
import { useEffect, useState, type PropsWithChildren } from "react";

interface BackgroundProps extends PropsWithChildren {
  imageSrc: string | null;
  backgroundColor: string;
}
export const Background = ({
  imageSrc,
  backgroundColor,
  children,
}: BackgroundProps) => {
  const [validImage, setValidImage] = useState(false);
  useEffect(() => {
    if (!imageSrc) {
      return;
    }
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setValidImage(true);
    };
    img.onerror = () => {
      setValidImage(false);
    };
  }, []);

  const backgroundImagePresent = imageSrc && validImage;
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...(backgroundImagePresent
          ? {
              backgroundImage: `url(${imageSrc})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "inset 0 0 10vh rgba(0,0,0,0.8)",
            }
          : {
              backgroundColor,
            }),
      }}
    >
      {children}
    </Box>
  );
};
