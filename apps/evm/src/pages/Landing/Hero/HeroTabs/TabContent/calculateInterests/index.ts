import { MONTHS_PER_YEAR } from 'constants/time';

export const calculateInterests = ({
  amount,
  apyPercentage,
  months,
}: {
  amount: number;
  apyPercentage: number;
  months: number;
}) => {
  const mpyPercentage = apyPercentage / MONTHS_PER_YEAR;

  return (amount * (mpyPercentage * months)) / 100;
};
