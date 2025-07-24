import { Dialog } from "@mui/material";
import { useState } from "react";
import paperScrap from "../assets/images/paperScrap.png";

export const PaperScrap = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <img
        src={paperScrap}
        alt="Paper Scrap"
        style={{ height: "4rem" }}
        onClick={handleOpen}
      />
      <Dialog open={open} onClose={handleClose}>
        <img src={paperScrap} alt="Paper Scrap" style={{ height: "16rem" }} />
      </Dialog>
    </>
  );
};
