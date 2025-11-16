import { Box, Button, Collapse } from "@mui/material";
import note from "./images/note.webp";
import { useState } from "react";
import { faqData } from "./data/faqData";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
export const HintsContent = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        aspectRatio: 1.47,
        width: "60vw",
        p: 8,
        backgroundImage: `url(${note})`,
        backgroundSize: "cover",
      }}
    >
      {faqData.map(({ question, answer }, index) => {
        const isOpen = expanded === `panel${String(index)}`;
        return (
          <Box key={`panel${String(index)}`}>
            <Button
              fullWidth
              size="large"
              endIcon={isOpen ? <ExpandLess /> : <ExpandMore />}
              id={`faq-header-${String(index)}`}
              aria-controls={`faq-panel-${String(index)}`}
              aria-expanded={isOpen}
              onClick={() => {
                setExpanded(isOpen ? null : `panel${String(index)}`);
              }}
              sx={{
                justifyContent: "space-between",
                color: "black",
                textTransform: "none",
                fontFamily: "charm",
                letterSpacing: 0.5,
              }}
            >
              {question}
            </Button>
            <Collapse in={isOpen}>
              <Box
                id={`faq-panel-${String(index)}`}
                aria-labelledby={`faq-header-${String(index)}`}
                sx={{
                  p: 4,
                  color: "black",
                  fontFamily: "charm",
                  letterSpacing: 0.5,
                }}
              >
                {answer}
              </Box>
            </Collapse>
          </Box>
        );
      })}
    </Box>
  );
};
