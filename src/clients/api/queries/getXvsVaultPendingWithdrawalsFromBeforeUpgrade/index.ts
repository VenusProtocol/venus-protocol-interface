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
  const pendingWithdrawalsFromBeforeUpgradeWei = await xvsVaultContract.methods
    .pendingWithdrawalsBeforeUpgrade(rewardTokenAddress, poolIndex, accountAddress)
    .call();

  return {
    pendingWithdrawalsFromBeforeUpgradeWei: new BigNumber(pendingWithdrawalsFromBeforeUpgradeWei),
  };
};

export default getXvsVaultPendingWithdrawalsFromBeforeUpgrade;
