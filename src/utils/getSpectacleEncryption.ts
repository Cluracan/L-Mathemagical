export const getSpectacleEncryption = (plainText: string) => {
  return plainText
    .split("")
    .map((curLetter) => {
      const curAscii = curLetter.charCodeAt(0);
      let newAscii;
      if (curAscii < 33) {
        return curLetter;
      }
      if (curAscii < 65) {
        newAscii = (((curAscii - 33) * 15) % 32) + 97;
      } else {
        newAscii = (((curAscii - 65) * 15) % 32) + 33;
      }
      return String.fromCharCode(newAscii);
    })
    .join("");
};
