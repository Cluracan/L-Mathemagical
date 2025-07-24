import { GlobalStyles } from "@mui/material";

interface AsciiContentProps {
  imageText: string;
  color?: string;
}

export const AsciiContent = ({
  imageText,
  color = "hsla(62, 67%, 69%, 1.00)",
}: AsciiContentProps) => {
  const modifiedImageText = imageText.replace("\\", "\\\\").replace("`", "\\`");
  return (
    <>
      <GlobalStyles
        styles={{
          pre: {
            color: color,
            lineHeight: "1rem",
            fontFamily: "monospace",
          },
        }}
      />
      <pre>{modifiedImageText}</pre>
    </>
  );
};
