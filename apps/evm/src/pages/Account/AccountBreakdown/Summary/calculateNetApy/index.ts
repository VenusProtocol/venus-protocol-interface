import BigNumber from 'bignumber.js';

const calculateNetApy = ({
  supplyBalanceCents,
  yearlyEarningsCents,
}: {
  supplyBalanceCents: BigNumber;
  yearlyEarningsCents: BigNumber;
}) => {
  // Calculate net APY as a percentage of supply balance, based on yearly interests
  let netApyPercentage: number | undefined;
  if (supplyBalanceCents?.isEqualTo(0)) {
    netApyPercentage = 0;
  } else if (supplyBalanceCents && yearlyEarningsCents) {
    netApyPercentage = +yearlyEarningsCents
      .multipliedBy(100)
      .dividedBy(supplyBalanceCents)
      .toFixed(2);
  }
  return netApyPercentage;
};

export default calculateNetApy;
