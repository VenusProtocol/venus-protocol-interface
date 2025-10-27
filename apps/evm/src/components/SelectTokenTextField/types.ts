import type { TokenBalance } from 'types';

export interface OptionalTokenBalance extends Omit<TokenBalance, 'balanceMantissa'> {
  balanceMantissa?: BigNumber;
}
