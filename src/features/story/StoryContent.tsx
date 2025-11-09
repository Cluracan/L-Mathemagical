import { Box, Button, Fade, Paper, Stack, Typography } from "@mui/material";
// import { Link } from "@tanstack/react-router";

import { useState } from "react";
import {
  FiberManualRecord,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import { storyText } from "./data/storyText";
import river from "./images/river.png";
import woods from "./images/woods.jpg";
import palace from "./images/palace.jpg";
import paper from "./images/paper.jpg";
import { Link } from "@tanstack/react-router";

// Types
interface StepperArgs {
  handleNext: () => void;
  handleBack: () => void;
  activeStep: number;
}

const storyImage = [river, woods, palace, paper];

export const StoryContent = () => {
  const [activeStep, setActiveStep] = useState(0);

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
      <Stack sx={{ width: "60vw", gap: 4, alignItems: "center" }}>
        <Fade in={true}>
          <img src={storyImage[activeStep]} style={{ width: "60vw" }} />
        </Fade>

        <Paper
          sx={{
            height: "12vh",
            overflowY: "auto",
            padding: 2,
          }}
        >
          <Typography>{storyText[activeStep]}</Typography>
        </Paper>
        <Stepper
          handleBack={handleBack}
          handleNext={handleNext}
          activeStep={activeStep}
        />
      </Stack>
    </>
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
