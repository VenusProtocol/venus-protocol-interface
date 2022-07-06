export interface ICalculatePercentageInput {
  numerator: number;
  denominator: number;
}

const calculatePercentage = ({ numerator, denominator }: ICalculatePercentageInput) => {
  if (denominator === 0) {
    return 0;
  }

  return (numerator * 100) / denominator;
};

export default calculatePercentage;
