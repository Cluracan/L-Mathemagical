import { createKeyGuard } from "../../../utils/createKeyGuard";

// Types
export interface TelephoneState {
  puzzleCompleted: boolean;
  number: number;
  feedback: string[];
  targetNumberIsEngaged: boolean;
}
export type TelephoneButton = keyof typeof telephoneButtons;

// Config
export const TARGET_NUMBER = 610;
export const INITIAL_NUMBER = 0;

// Narrative Content
export const telephoneFeedback = {
  instructions: [
    "This telephone only accepts three digit numbers (000-999)",
    "Choose a number using either the onscreen keypad or your keyboard, then press DIAL",
  ],
  reply: {
    1: `You are listening to a recording of the weather forecast. The heat wave is going to continue.`,
    2: `It's a crossed line. A man and a woman are having a rather private conversation. They don't seem to be able to hear you.`,
    3: `A lady is talking very fast in Spanish. You don't understand a thing.`,
    5: `It's a recording of motoring information. The fine weather is causing jams.`,
    8: `It's a recording of a bedtime story--something dull about a thirteenth century Italian.`,
    13: `The recorded gardening information tells you it's a good time to plant sunflowers.`,
    21: `It's an answering machine for a Pizza restaurant. You don't bother leaving a message.`,
    34: `A recording tells you "What's on in Loughborough." It doesn't last long.`,
    55: `A voice says "Look, I told you not to ring me at work," and hangs up.`,
    89: `It's the financial news. Apparently an improvement in the economy is expected soon.`,
    144: `It's the cricket. England are 132 for six.`,
    233: `The recipe of the day sounds revolting. Anyway, you are not hungry.`,
    377: `It's the skiing information. There isn't a lot of snow about.`,
    610: `You hear a recorded message saying, "The line is busy, please try again later."`,
    987: `An irate voice says "You really have gone too far this time!", and slams the phone down.`,
  },
  noReply: "The number rings but there is no reply.",
  success:
    "It's the abbot. He wishes you luck and tells you there is a trap door hidden under the chest. It leads down to some cellars. You will have no difficulty moving the chest if you drop everything you are carrying",
  storyLineFailure:
    "You put the phone down, but get the feeling that someone is still waiting for your call...",
  storyLineSuccess:
    'You put the phone down, and consider the Abbot\'s message - "...drop everything and move the chest..."',
};
export const hasReply = createKeyGuard(telephoneFeedback.reply);

// Constants
export const telephoneButtons = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  null,
  0,
  null,
] as const;

// Initial State
export const initialTelephoneState: TelephoneState = {
  puzzleCompleted: false,
  feedback: telephoneFeedback.instructions,
  number: INITIAL_NUMBER,
  targetNumberIsEngaged: true,
};
