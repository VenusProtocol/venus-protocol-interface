import BigNumber from 'bignumber.js';

import type { XvsVault } from 'libs/contracts';

export interface GetXvsVaultPendingWithdrawalsBalanceInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
}

export type GetXvsVaultPendingWithdrawalsBalanceOutput = {
  balanceMantissa: BigNumber;
};

export const getXvsVaultPendingWithdrawalsBalance = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
}: GetXvsVaultPendingWithdrawalsBalanceInput): Promise<GetXvsVaultPendingWithdrawalsBalanceOutput> => {
  const resp = await xvsVaultContract.totalPendingWithdrawals(rewardTokenAddress, poolIndex);

  return {
    balanceMantissa: new BigNumber(resp.toString()),
  };
};
