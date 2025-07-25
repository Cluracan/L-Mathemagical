import { Box, Button, Card, CardActions, CardContent } from "@mui/material";
import { Link } from "@tanstack/react-router";
import castleAscii from "./data/castleAscii.txt?raw";
import mapFragment from "./images/mapFragment.png";
import { storyText } from "./data/storyText";
import { AsciiContent } from "../../components/AsciiContent";
import { ImageZoom } from "../../components/ImageZoom";
import { TextContent } from "../../components/TextContent";

export const StoryContent = () => {
  return (
    <>
      <AsciiContent imageText={castleAscii} color="hsla(62, 67%, 69%, 1.00)" />
      <Card
        sx={{
          maxWidth: "32vw",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem",
        }}
      >
        <CardContent>
          <TextContent text={storyText} />
        </CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <CardActions>
            <Button variant="outlined" component={Link} to="/">
              Back
            </Button>
          </CardActions>
          <ImageZoom
            src={mapFragment}
            alt="A small fragment of a map"
            smallSize="4rem"
            largeSize="16rem"
          />
        </Box>
      </Card>
    </>
  );
};
