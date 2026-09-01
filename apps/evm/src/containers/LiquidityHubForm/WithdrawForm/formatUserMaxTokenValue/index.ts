import type BigNumber from 'bignumber.js';
import { TRANSACTION_BUFFER_PERCENTAGE } from 'constants/fullRepaymentBuffer';

export const formatUserMaxTokenValue = (
  {
    value,
    decimals,
  }: {
    value?: BigNumber;
    decimals: number;
  }, // Apply buffer to account for accruing interests that lower the limits while a transaction is
) =>
  // being executed
  value
    ?.multipliedBy(1 - TRANSACTION_BUFFER_PERCENTAGE)
    .dp(decimals);
