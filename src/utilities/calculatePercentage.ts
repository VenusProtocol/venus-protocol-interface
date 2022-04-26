export interface ICalculatePercentageInput {
  numerator: number;
  denominator: number;
}

const calculatePercentage = ({ numerator, denominator }: ICalculatePercentageInput) =>
  Math.round((numerator * 100) / denominator);

export default calculatePercentage;
