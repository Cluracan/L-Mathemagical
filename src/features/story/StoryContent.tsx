import {
  Box,
  Button,
  Container,
  Fade,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { memo, useEffect, useState, type PropsWithChildren } from "react";
import {
  FiberManualRecord,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { storyText } from "./data/storyText";
import river from "./images/riverColor.webp";
import woods from "./images/woodsColor.webp";
import palace from "./images/palaceColor.webp";
import paper from "./images/paperColor.webp";
import frame from "./images/frame.webp";
import { HomeLink } from "../../components/HomeLink";

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

interface StepperArgs {
  handleNext: () => void;
  handleBack: () => void;
  activeStep: number;
}

interface StoryTextProps {
  text: string;
}

// Constants
const IMAGE_ASPECT_RATIO = 1.5;
const gallery = [
  {
    painting: {
      url: river,
      alt: "Sunlight glints of the river as it winds through the trees",
    },
    text: storyText[0],
  },
  {
    painting: {
      url: woods,
      alt: "Tall beech trees overhang the path as it continues through the woods.",
    },
    text: storyText[1],
  },
  {
    painting: {
      url: palace,
      alt: "The beech trees frame a large meadow. In the distance is a medeival castle.",
    },
    text: storyText[2],
  },
  {
    painting: {
      url: paper,
      alt: "A torn corner of a map stands in the grass, showing a single room, titled 'downstairs pantry'",
    },
    text: storyText[3],
  },
];

export const StoryContent = () => {
  // State
  const [activeStep, setActiveStep] = useState(0);

  // Effects
  useEffect(() => {
    gallery.forEach(({ painting }) => {
      const img = new Image();
      img.src = painting.url;
    });
  }, []);

  // Handlers
  const handleNext = () => {
    setActiveStep((step) => step + 1);
  };
  const handleBack = () => {
    setActiveStep((step) => step - 1);
  };

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
        <StoryPainting painting={gallery[activeStep].painting} height="50vh" />

        <Stepper
          handleBack={handleBack}
          handleNext={handleNext}
          activeStep={activeStep}
        />
        <StoryText text={gallery[activeStep].text} />
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
