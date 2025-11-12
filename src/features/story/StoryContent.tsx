import {
  Box,
  Button,
  Fade,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
// import { Link } from "@tanstack/react-router";

import { useEffect, useState } from "react";
import {
  FiberManualRecord,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { storyText } from "./data/storyText";
import river from "./images/riverColor.png";
import woods from "./images/woodsColor.png";
import palace from "./images/palaceColor.png";
import paper from "./images/paperColor2.png";
import frame from "./images/frame.png";

import { Link } from "@tanstack/react-router";

// Types
interface StoryImageProps {
  storyImage: { url: string; alt: string };
  width: string;
}

interface StepperArgs {
  handleNext: () => void;
  handleBack: () => void;
  activeStep: number;
}

// Constants
const IMAGE_ASPECT_RATIO = 1.5;
const storyImage = [
  {
    url: river,
    alt: "Sunlight glints of the river as it winds through the trees",
  },
  {
    url: woods,
    alt: "Tall beech trees overhang the path as it continues through the woods.",
  },
  {
    url: palace,
    alt: "The beech trees frame a large meadow. In the distance is a medeival castle.",
  },
  {
    url: paper,
    alt: "A torn corner of a map stands in the grass, showing a single room, titled 'downstairs pantry'",
  },
];

export const StoryContent = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    storyImage.forEach(({ url }) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  const handleNext = () => {
    setActiveStep((step) => step + 1);
  };
  const handleBack = () => {
    setActiveStep((step) => step - 1);
  };
  return (
    <>
      <Button
        variant="outlined"
        component={Link}
        to="/"
        sx={{ position: "absolute", left: "2rem", top: "2rem" }}
      >
        Main Menu
      </Button>
      <Stack
        sx={{
          width: "40vw",
          height: "100vh",
          p: 2,
          gap: 4,
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <StoryImage storyImage={storyImage[activeStep]} width="40vw" />

        <Stepper
          handleBack={handleBack}
          handleNext={handleNext}
          activeStep={activeStep}
        />
        <Paper
          elevation={6}
          sx={{
            // height: "12vh",
            width: "80%",
            overflowY: "auto",
            padding: 2,
          }}
        >
          <Typography>{storyText[activeStep]}</Typography>
        </Paper>
      </Stack>
    </>
  );
};

const StoryImage = ({ storyImage, width }: StoryImageProps) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = storyImage.url;
    img.onload = () => {
      setLoaded(true);
    };
    return () => {
      setLoaded(false);
    };
  }, [storyImage]);

  return loaded ? (
    <Fade in={true} timeout={800}>
      <Box
        sx={{
          width,
          aspectRatio: IMAGE_ASPECT_RATIO,
          position: "relative",
          borderImageSource: `url(${frame})`,
          borderImageSlice: 76,
          borderImageRepeat: "stretch",
          borderStyle: "solid",
          borderWidth: "2.5vw",
          borderImageOutset: 0,
          boxShadow: "12px 6px 5px #18201aff ",
        }}
      >
        <img
          src={storyImage.url}
          alt={storyImage.alt}
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
      </Box>
    </Fade>
  ) : (
    <Skeleton
      variant="rectangular"
      animation="wave"
      height={"55vh"}
      width={width}
    />
  );
};

const Stepper = (args: StepperArgs) => {
  const { handleBack, handleNext, activeStep } = args;
  const maxSteps = storyText.length;
  return (
    <Stack
      direction={"row"}
      sx={{ width: "100%", justifyContent: "space-around" }}
    >
      <Button
        onClick={handleBack}
        disabled={activeStep === 0}
        startIcon={<KeyboardArrowLeft />}
      >
        Back
      </Button>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {storyText.map((_, i) => (
          <FiberManualRecord
            key={i}
            sx={{
              height: 0.5,
              color: activeStep === i ? "primary.main" : "action.disabled",
            }}
          />
        ))}
      </Box>

      <Button
        onClick={handleNext}
        disabled={activeStep === maxSteps - 1}
        endIcon={<KeyboardArrowRight />}
      >
        Next
      </Button>
    </Stack>
  );
};
