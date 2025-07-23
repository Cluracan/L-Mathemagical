import { Box } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/adventure")({
  component: Adventure,
});

function Adventure() {
  return (
    <>
      <Box>
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        {"Hello from Adventure!"}

        <Box sx={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
          <img
            src="../src/assets/images/LogoL.svg"
            alt="L - Logo"
            style={{ width: "50%" }}
          />
        </Box>
      </Box>
    </>
  );
}
