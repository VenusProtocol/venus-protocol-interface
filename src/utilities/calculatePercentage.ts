export interface CalculatePercentageInput {
  numerator: number;
  denominator: number;
}

export const calculatePercentage = ({ numerator, denominator }: CalculatePercentageInput) => {
  if (denominator === 0) {
    return 0;
  }

  return (numerator * 100) / denominator;
};
