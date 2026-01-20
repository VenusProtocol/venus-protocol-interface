import BigNumber from 'bignumber.js';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { formatCentsToReadableValue } from 'utilities';

export const calcBorrowInterest = (apy: BigNumber | undefined, base = 10_000, month = 12) => {
  if (!BigNumber.isBigNumber(apy)) return PLACEHOLDER_KEY;

  const apyRate = 1 + apy.shiftedBy(-2).toNumber() / 12;
  const interest = base * apyRate ** month;

  return formatCentsToReadableValue({ value: (interest - base) * 100 });
};
