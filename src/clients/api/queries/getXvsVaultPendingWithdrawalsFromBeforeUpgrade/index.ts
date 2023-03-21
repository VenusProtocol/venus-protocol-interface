import BigNumber from 'bignumber.js';

import {
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput,
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
} from './types';

export * from './types';

const getXvsVaultPendingWithdrawalsFromBeforeUpgrade = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput): Promise<GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput> => {
  const pendingWithdrawalsFromBeforeUpgradeWei =
    await xvsVaultContract.pendingWithdrawalsBeforeUpgrade(
      rewardTokenAddress,
      poolIndex,
      accountAddress,
    );

  return {
    pendingWithdrawalsFromBeforeUpgradeWei: new BigNumber(
      pendingWithdrawalsFromBeforeUpgradeWei.toString(),
    ),
  };
};

export default getXvsVaultPendingWithdrawalsFromBeforeUpgrade;
