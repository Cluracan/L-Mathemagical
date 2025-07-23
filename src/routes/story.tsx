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
import { useState } from "react";
import paperScrap from "../assets/images/paperScrap.bmp";

import { storyText } from "../assets/data/instructions";

export const Route = createFileRoute("/story")({
  component: RouteComponent,
});

function RouteComponent() {
  const [paperScrapWidth, setPaperScrapWidth] = useState<"4rem" | "16rem">(
    "4rem"
  );
  return (
    <>
      <GlobalStyles
        styles={{
          pre: { color: "hsla(62, 67%, 69%, 1.00)", lineHeight: "1rem" },
        }}
      />

      <pre>{`                                                  !_
                                                  |*~=-.,
                                                  |_,-'\`
                                                  |
                                                  |
                                                 /^\\
                   !_                           /   \\
                   |*\`~-.,                     /,    \\
                   |.-~^\`                     /#"     \\
                   |                        _/##_   _  \\_
              _   _|  _   _   _            [ ]_[ ]_[ ]_[ ]
             [ ]_[ ]_[ ]_[ ]_[ ]            |_=_-=_ - =_|
           !_ |_=_ =-_-_  = =_|           !_ |=_= -    |
           |*\`--,_- _        |            |*\`~-.,= []  |
           |.-'|=     []     |   !_       |_.-"\`_-     |
           |   |_=- -        |   |*\`~-.,  |  |=_-      |
          /^\\  |=_= -        |   |_,-~\`  /^\\ |_ - =[]  |
      _  /   \\_|_=- _   _   _|  _|  _   /   \\|=_-      |
     [ ]/,    \\[ ]_[ ]_[ ]_[ ]_[ ]_[ ]_/,    \\[ ]=-    |
      |/#"     \\_=-___=__=__- =-_ -=_ /#"     \\| _ []  |
     _/##_   _  \\_-_ =  _____       _/##_   _  \\_ -    |\\
    [ ]_[ ]_[ ]_[ ]=_0~{_ _ _}~0   [ ]_[ ]_[ ]_[ ]=-   | \\
    |_=__-_=-_  =_|-=_ |     |     |_=-___-_ =-__|_    |  \\
     | _- =-     |-_   | ((* |      |= _=       | -    |___\\
     |= -_=      |=  _ |  \`  |      |_-=_       |=_    |/+\\|
     | =_  -     |_ = _ \`-.-\`       | =_ = =    |=_-   ||+||
     |-_=- _     |=_   =            |=_= -_     |  =   ||+||
     |=_- /+\\    | -=               |_=- /+\\    |=_    |^^^|
     |=_ |+|+|   |= -  -_,--,_      |_= |+|+|   |  -_  |=  |
     |  -|+|+|   |-_=  / |  | \\     |=_ |+|+|   |-=_   |_-/
     |=_=|+|+|   | =_= | |  | |     |_- |+|+|   |_ =   |=/
     | _ ^^^^^   |= -  | |  <&>     |=_=^^^^^   |_=-   |/
     |=_ =       | =_-_| |  | |     |   =_      | -_   |
     |_=-_       |=_=  | |  | |     |=_=        |=-    |
^^^^^^^^^^\`^\`^^\`^\`^\`^^^""""""""^\`^^\`\`^^\`^^\`^^\`^\`^\`\`^\`^\`\`^\`\`^^`}</pre>
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
          <img
            src={paperScrap}
            alt="Paper Scrap"
            style={{ width: `${paperScrapWidth}` }}
            onClick={() => {
              setPaperScrapWidth((prev) =>
                prev === "4rem" ? "16rem" : "4rem"
              );
            }}
          />
        </Box>
      </Card>
      {/* </Box> */}
    </>
  );
}
