import type BigNumber from 'bignumber.js';

import type { Token } from 'types';

const calculatePercentageOfUserBorrowBalance = ({
  userBorrowBalanceTokens,
  token,
  percentage,
}: {
  userBorrowBalanceTokens: BigNumber;
  token: Token;
  percentage: number;
}) =>
  userBorrowBalanceTokens
    .multipliedBy(percentage / 100)
    .decimalPlaces(token.decimals)
    .toFixed();

export default calculatePercentageOfUserBorrowBalance;
