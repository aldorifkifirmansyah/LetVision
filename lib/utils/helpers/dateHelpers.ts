export const parseEstimationDays = (estimation: string): number => {
  // Remove the ± symbol and "hari" word, then parse the number
  const numberMatch = estimation.replace("±", "").replace("hari", "").trim();
  return parseInt(numberMatch, 10);
};
