export interface GetProgressBarValuePercentageInput {
  value: number;
  min: number;
  max: number;
}

export const getProgressBarValuePercentage = ({
  value,
  min,
  max,
}: GetProgressBarValuePercentageInput) => {
  if (max <= min) {
    return 0;
  }

  return ((value - min) / (max - min)) * 100;
};
