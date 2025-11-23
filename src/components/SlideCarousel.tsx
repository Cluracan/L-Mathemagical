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
import frame from "../assets/images/frame.webp";

// Types
interface Slide {
  url: string;
  alt: string;
}

type Gallery = { slide: Slide; text: string }[];

interface FramedSlideProps {
  slide: Slide;
  height: string;
}

interface SlideFrameProps extends PropsWithChildren {
  height: string;
}

interface SlideContentProps {
  slide: Slide;
}

interface CarouselStepperArgs {
  handleNext: () => void;
  handleBack: () => void;
  activeStep: number;
  gallery: Gallery;
}

interface CaptionPanelProps {
  text: string;
}

interface SlideCarouselProps {
  gallery: Gallery;
}

export const SlideCarousel = ({ gallery }: SlideCarouselProps) => {
  // State
  const [activeStep, setActiveStep] = useState(0);

  // Effects
  useEffect(() => {
    gallery.forEach(({ slide }) => {
      const img = new Image();
      img.src = slide.url;
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
      <Stack sx={{ height: "100%", p: 2 }}>
        <Stack
          direction={"row"}
          sx={{
            height: "80vh",
            p: 2,
            gap: 6,
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          <FramedSlide slide={gallery[activeStep].slide} height="50vh" />

          <CaptionPanel text={gallery[activeStep].text} />
        </Stack>

        <CarouselStepper
          handleBack={handleBack}
          handleNext={handleNext}
          activeStep={activeStep}
          gallery={gallery}
        />
      </Stack>
    </>
  );
};

const FramedSlide = ({ slide, height }: FramedSlideProps) => {
  return (
    <SlideFrame height={height}>
      <SlideContent slide={slide} />
    </SlideFrame>
  );
};

const SlideFrame = memo(({ height, children }: SlideFrameProps) => {
  const [aspectRatio, setAspectRatio] = useState(1.5);
  useEffect(() => {
    const img = new Image();
    img.src = frame;
    img.onload = () => {
      console.log(img.height, img.width, img.width / img.height);
      setAspectRatio(img.width / img.height);
    };
  }, []);
  return (
    <Box
      aria-hidden="true"
      role="presentation"
      sx={{
        position: "relative",
        height,
        aspectRatio,
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
SlideFrame.displayName = "Frame";

const SlideContent = ({ slide }: SlideContentProps) => {
  return (
    <Fade key={slide.url} in={true} timeout={800}>
      <Container
        disableGutters
        sx={{ width: "100%", height: "100%", padding: 0 }}
      >
        <img
          src={slide.url}
          alt={slide.alt}
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

const CarouselStepper = (args: CarouselStepperArgs) => {
  const { handleBack, handleNext, activeStep, gallery } = args;
  const maxSteps = gallery.length;
  return (
    <Stack
      direction={"row"}
      sx={{
        width: "100%",
        mt: "auto",
        p: 2,
        justifyContent: "space-around",
      }}
    >
      <Button
        onClick={handleBack}
        disabled={activeStep === 0}
        startIcon={<KeyboardArrowLeft />}
      >
        Back
      </Button>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {gallery.map((_, i) => (
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

const CaptionPanel = ({ text }: CaptionPanelProps) => {
  return (
    <Paper
      elevation={6}
      sx={{
        width: { md: "30vw", xl: "20vw" },
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
