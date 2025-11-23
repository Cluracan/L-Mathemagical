import { storyText } from "./data/storyText";
import river from "./images/riverColor.webp";
import woods from "./images/woodsColor.webp";
import palace from "./images/palaceColor.webp";
import paper from "./images/paperColor.webp";

import { HomeLink } from "../../components/HomeLink";
import { SlideCarousel } from "../../components/SlideCarousel";

// Constants

const gallery = [
  {
    slide: {
      url: river,
      alt: "Sunlight glints of the river as it winds through the trees",
    },
    text: storyText[0],
  },
  {
    slide: {
      url: woods,
      alt: "Tall beech trees overhang the path as it continues through the woods.",
    },
    text: storyText[1],
  },
  {
    slide: {
      url: palace,
      alt: "The beech trees frame a large meadow. In the distance is a medeival castle.",
    },
    text: storyText[2],
  },
  {
    slide: {
      url: paper,
      alt: "A torn corner of a map stands in the grass, showing a single room, titled 'downstairs pantry'",
    },
    text: storyText[3],
  },
];

export const StoryContent = () => {
  // Render
  return (
    <>
      <HomeLink />
      <SlideCarousel gallery={gallery} />
    </>
  );
};
