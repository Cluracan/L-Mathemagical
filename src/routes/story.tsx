import { createFileRoute } from "@tanstack/react-router";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  GlobalStyles,
} from "@mui/material";

import { PaperScrap } from "../components/PaperScrap";
import { storyText } from "../assets/data/instructions";
import castleText from "../assets/images/castle.txt?raw";
const modifiedCastleText = castleText.replace("\\", "\\\\").replace("`", "\\`");

export const Route = createFileRoute("/story")({
  component: RouteComponent,
});

function RouteComponent() {
  console.log("Story route loaded");

  return (
    <>
      <GlobalStyles
        styles={{
          pre: { color: "hsla(62, 67%, 69%, 1.00)", lineHeight: "1rem" },
        }}
      />

      <pre>{modifiedCastleText}</pre>
      <Card
        sx={{
          maxWidth: "32vw",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
        }}
      >
        <CardContent>
          {storyText.map((text, index) => (
            <Typography
              key={index}
              variant="body1"
              sx={{ marginBottom: "1rem" }}
            >
              {text}
            </Typography>
          ))}
        </CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <CardActions>
            <Button variant="outlined" href="/">
              Back
            </Button>
          </CardActions>
          <PaperScrap />
        </Box>
      </Card>
    </>
  );
}
