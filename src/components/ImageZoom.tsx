import { Dialog } from "@mui/material";
import { useState } from "react";

// Currently unused

interface ImageZoomProps {
  src: string;
  alt?: string;
  smallSize?: string;
  largeSize?: string;
}

export const ImageZoom = ({
  src,
  alt = "Zoomable Image   ",
  smallSize = "4rem",
  largeSize = "16rem",
}: ImageZoomProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        style={{ height: smallSize, cursor: "pointer" }}
        onClick={() => {
          setOpen(true);
        }}
      />
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <img src={src} alt={alt} style={{ height: largeSize }} />
      </Dialog>
    </>
  );
};
