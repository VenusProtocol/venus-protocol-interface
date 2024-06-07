import BigNumber from 'bignumber.js';

import type {
  GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeInput,
  GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput,
} from './types';

export * from './types';

const getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeInput): Promise<GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput> => {
  const userPendingWithdrawalsFromBeforeUpgradeMantissa =
    await xvsVaultContract.pendingWithdrawalsBeforeUpgrade(
      rewardTokenAddress,
      poolIndex,
      accountAddress,
    );

  return {
    userPendingWithdrawalsFromBeforeUpgradeMantissa: new BigNumber(
      userPendingWithdrawalsFromBeforeUpgradeMantissa.toString(),
    ),
  };
};

export default getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade;
