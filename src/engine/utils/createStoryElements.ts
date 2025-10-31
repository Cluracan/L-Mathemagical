import type { EntryType, StoryLineEntry } from "../../store/useGameStore";

interface CreateStoryElementArgs {
  text: string[];
  type: EntryType;
  isEncrypted: boolean;
}

export const createStoryElements = (
  args: CreateStoryElementArgs
): StoryLineEntry[] => {
  const { text, type, isEncrypted } = args;
  const storyElements = text.map((curText) => {
    return { type, text: curText, isEncrypted };
  });
  return storyElements;
};
