import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  GlobalStyles,
} from "@mui/material";
import mapFragment from "./images/mapFragment.png";
import { storyText } from "./data/instructions";
import castleText from "./data/castle.txt?raw";
import { ImageZoom } from "../../components/ImageZoom";
import { CardTextContent } from "../../components/CardTextContent";
const modifiedCastleText = castleText.replace("\\", "\\\\").replace("`", "\\`");

export const StoryCard = () => {
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
          <CardTextContent text={storyText} />
        </CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <CardActions>
            <Button variant="outlined" href="/">
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
