import BigNumber from 'bignumber.js';

const compareBigNumbers = (
  valueA: BigNumber | undefined,
  valueB: BigNumber | undefined,
  direction: 'asc' | 'desc',
): number => {
  if (!valueA || !valueB) {
    return 0;
  }

  if (valueA.isLessThan(valueB)) {
    return direction === 'asc' ? -1 : 1;
  }

  if (valueA.isGreaterThan(valueB)) {
    return direction === 'asc' ? 1 : -1;
  }

  return 0;
};

export default compareBigNumbers;
