import { createFileRoute } from "@tanstack/react-router";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  GlobalStyles,
} from "@mui/material";
import { storyText } from "../assets/data/instructions";

export const Route = createFileRoute("/story")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <GlobalStyles
        styles={{
          pre: { color: "hsla(62, 67%, 69%, 1.00)", "line-height": "1rem" },
        }}
      />
      {/* <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
        }}
      > */}
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
          "overflow-y": "auto",
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
        <CardActions>
          <Button variant="outlined" href="/">
            Back
          </Button>
        </CardActions>
      </Card>
      {/* </Box> */}
    </>
  );
}
