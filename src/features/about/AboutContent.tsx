import BBCMicro1 from "./images/BBCMicro1.webp";
import BBCMicro2 from "./images/BBCMicro2.webp";
import { HomeLink } from "../../components/HomeLink";
import { aboutText } from "./data/aboutText";
import { SlideCarousel } from "../../components/SlideCarousel";

// Constants

const gallery = [
  {
    slide: {
      url: BBCMicro1,
      alt: "A BBC MicroComputer",
    },
    text: aboutText[0],
  },
  {
    slide: {
      url: BBCMicro2,
      alt: "A BBC MicroComputer on a desk. On the monitor is a puzzle from 'L - A mathemagical adventure'",
    },
    text: aboutText[1],
  },
];

export const AboutContent = () => {
  return (
    <>
      <HomeLink />
      <SlideCarousel gallery={gallery} />
    </>
  );
};
