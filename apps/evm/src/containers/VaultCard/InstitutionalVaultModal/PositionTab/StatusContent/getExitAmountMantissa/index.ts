import BigNumber from 'bignumber.js';
import type { VaultStatus } from 'types';

export interface GetExitAmountMantissaInput {
  fallbackAmountMantissa?: BigNumber;
  primaryAmountMantissa: BigNumber;
  requiredStatus: VaultStatus;
  status: VaultStatus;
}

export const getExitAmountMantissa = ({
  fallbackAmountMantissa,
  primaryAmountMantissa,
  requiredStatus,
  status,
}: GetExitAmountMantissaInput): BigNumber => {
  if (primaryAmountMantissa.gt(0)) {
    return primaryAmountMantissa;
  }

  if (status !== requiredStatus) {
    return new BigNumber(0);
  }

  return fallbackAmountMantissa ?? new BigNumber(0);
};
