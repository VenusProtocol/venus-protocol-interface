import BigNumber from 'bignumber.js';

import type {
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
  const pendingWithdrawalsFromBeforeUpgradeMantissa =
    await xvsVaultContract.pendingWithdrawalsBeforeUpgrade(
      rewardTokenAddress,
      poolIndex,
      accountAddress,
    );

  return {
    pendingWithdrawalsFromBeforeUpgradeMantissa: new BigNumber(
      pendingWithdrawalsFromBeforeUpgradeMantissa.toString(),
    ),
  };
};

export default getXvsVaultPendingWithdrawalsFromBeforeUpgrade;
