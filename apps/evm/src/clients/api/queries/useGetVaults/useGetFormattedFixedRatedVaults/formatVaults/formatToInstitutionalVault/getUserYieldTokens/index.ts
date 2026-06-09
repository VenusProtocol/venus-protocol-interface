import BigNumber from 'bignumber.js';

import { VaultStatus } from 'types';

export interface GetUserYieldTokensInput {
  status: VaultStatus;
  userStakedTokens: BigNumber;
  userWithdrawTokens: BigNumber;
  userWithdrawLimitMantissa: BigNumber;
}

export const getUserYieldTokens = ({
  status,
  userStakedTokens,
  userWithdrawTokens,
  userWithdrawLimitMantissa,
}: GetUserYieldTokensInput): BigNumber | undefined => {
  if (status === VaultStatus.Refund) {
    return new BigNumber(0);
  }

  if (
    status === VaultStatus.Liquidated ||
    (status === VaultStatus.Claim && userWithdrawLimitMantissa.gt(0))
  ) {
    return userWithdrawTokens.minus(userStakedTokens);
  }

  return undefined;
};
