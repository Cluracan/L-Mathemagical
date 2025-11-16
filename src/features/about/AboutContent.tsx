import { Box, Container, Fade, Paper, Stack, Typography } from "@mui/material";

import { memo, useEffect, type PropsWithChildren } from "react";

import frame from "../story/images/frame.webp";
import BBCMicro from "./images/BBCMicro.webp";
import { HomeLink } from "../../components/HomeLink";
import { aboutText } from "./data/aboutText";

// Types
interface StoryPaintingProps {
  painting: { url: string; alt: string };
  height: string;
}

interface StoryFrameProps extends PropsWithChildren {
  height: string;
}

interface StoryImageProps {
  painting: { url: string; alt: string };
}

interface StoryTextProps {
  text: string;
}

// Constants
const IMAGE_ASPECT_RATIO = 1.5;

export const AboutContent = () => {
  // State

  // Effects
  useEffect(() => {
    const img = new Image();
    img.src = BBCMicro;
  }, []);

  // Render
  return (
    <>
      <HomeLink />
      <Stack
        sx={{
          height: "100vh",
          width: "50vw",
          p: 2,
          gap: 4,
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <StoryPainting
          painting={{ url: BBCMicro, alt: "BBC Microcomputer" }}
          height="50vh"
        />

        <StoryText text={aboutText[0]} />
      </Stack>
    </>
  );
};

const StoryPainting = ({ painting, height }: StoryPaintingProps) => {
  return (
    <StoryFrame height={height}>
      <StoryImage painting={painting} />
    </StoryFrame>
  );
};

const StoryFrame = memo(({ height, children }: StoryFrameProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        height,
        aspectRatio: IMAGE_ASPECT_RATIO,
        borderImageSource: `url(${frame})`,
        borderImageSlice: 76,
        borderImageRepeat: "stretch",
        borderStyle: "solid",
        borderWidth: "2.5vw",
        borderImageOutset: 0,
        boxShadow: "12px 6px 5px #18201aff ",
      }}
    >
      {children}
    </Box>
  );
});
StoryFrame.displayName = "StoryFrame";

const StoryImage = ({ painting }: StoryImageProps) => {
  return (
    <Fade key={painting.url} in={true} timeout={800}>
      <Container
        disableGutters
        sx={{ width: "100%", height: "100%", padding: 0 }}
      >
        <img
          src={painting.url}
          alt={painting.alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Box
          //Inset shadow (must render after img)
          sx={{
            height: "100%",
            width: "100%",
            position: "absolute",
            inset: 0,
            boxShadow: "inset 4px 4px 20px 4px #000000ff",
          }}
        />
      </Container>
    </Fade>
  );
};

const StoryText = ({ text }: StoryTextProps) => {
  return (
    <Paper
      elevation={6}
      sx={{
        width: "30vw",
        padding: 2,
        overflowY: "auto",
        backgroundColor: "gold",
        color: "black",
        "& .MuiTypography-root": {
          fontFamily: "charm",
          letterSpacing: 0.5,
        },
      }}
    >
      <Typography>{text}</Typography>
    </Paper>
  );
};
