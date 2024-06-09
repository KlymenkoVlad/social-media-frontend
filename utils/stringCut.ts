export const stringCut = (str: string, maxLength = 20) => {
  if (str && str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
};
