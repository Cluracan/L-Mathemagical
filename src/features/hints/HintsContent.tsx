import { Box, Card, CardContent, Collapse, Typography } from "@mui/material";
import note from "./images/note.webp";
export const HintsContent = () => {
  return (
    <>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#2b392e",
        }}
      >
        <Box sx={{ height: "50vh" }}>
          <Card
            sx={{
              aspectRatio: 1.47,
              width: "60vw",
              p: 4,
              backgroundImage: `url(${note})`,
              backgroundSize: "cover",
              backgroundColor: "transparent",
              boxShadow: "none",
              color: "black",
              "& .MuiTypography-root": {
                fontFamily: "charm",
                letterSpacing: 0.5,
              },
            }}
          >
            <CardContent>
              <Typography>What&apos;s going on?</Typography>
              <Collapse in={true}>
                <Typography>
                  Somewhere nearby is a magical palace full of puzzles and
                  strange creatures. To move around and interact with the world,
                  you type simple commands at the prompt. Your experiences may
                  be intriguing or puzzling. Talk about them with fellow
                  adventurers, but do not give anything away to those who may be
                  following. Somewhere nearby is a magical palace full of
                  puzzles and strange creatures. To move around and interact
                  with the world, you type simple commands at the prompt. Your
                  experiences may be intriguing or puzzling. Talk about them
                  with fellow adventurers, but do not give anything away to
                  those who may be following.
                </Typography>
              </Collapse>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};
