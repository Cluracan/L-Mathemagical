import { KeyboardArrowLeft } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link } from "@tanstack/react-router";

export const HomeLink = () => {
  return (
    <Button
      variant="outlined"
      component={Link}
      to="/"
      sx={{ position: "absolute", left: "2rem", top: "2rem" }}
      startIcon={<KeyboardArrowLeft />}
    >
      Home
    </Button>
  );
};
