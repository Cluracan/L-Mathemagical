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

import { PaperScrap } from "../components/PaperScrap";
import { storyText } from "../assets/data/instructions";

export const Route = createFileRoute("/story")({
  component: RouteComponent,
});

function RouteComponent() {
  console.log("Story route loaded");

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
          <PaperScrap />
        </Box>
      </Card>
    </>
  );
}
