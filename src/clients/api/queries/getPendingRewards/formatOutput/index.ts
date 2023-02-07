import BigNumber from 'bignumber.js';
import { ContractCallResults } from 'ethereum-multicall';
import { getTokenByAddress } from 'utilities';

import { TOKENS } from 'constants/tokens';

import { PendingRewardGroup, PoolPendingRewardGroup, VaultPendingRewardGroup } from '../types';
import formatToPoolPendingRewardGroup from './formatToPoolPendingRewardGroup';

const formatOutput = ({
  contractCallResults,
}: {
  contractCallResults: ContractCallResults;
}): PendingRewardGroup[] => {
  const pendingRewardGroups: PendingRewardGroup[] = [];

  // Extract pending rewards from main pool
  const mainPoolPendingRewardGroup = formatToPoolPendingRewardGroup({
    callsReturnContext: contractCallResults.results.venusLens.callsReturnContext[0],
  });

  if (mainPoolPendingRewardGroup) {
    pendingRewardGroups.push(mainPoolPendingRewardGroup);
  }

  // Extract pending rewards from isolated pools
  const isolatedPoolPendingRewardGroups = (
    contractCallResults.results.poolLens?.callsReturnContext
      // Ignore last call result as it is the oracle address
      .slice(0, -1) || []
  ).reduce<PoolPendingRewardGroup[]>((acc, callsReturnContext) => {
    const isolatedPoolPendingRewardGroup = formatToPoolPendingRewardGroup({
      callsReturnContext,
    });

    if (!isolatedPoolPendingRewardGroup) {
      return acc;
    }

    return [...acc, isolatedPoolPendingRewardGroup];
  }, []);

  if (isolatedPoolPendingRewardGroups.length > 0) {
    pendingRewardGroups.concat(isolatedPoolPendingRewardGroups);
  }

  // Extract pending rewards from VRT vault
  const vrtVaultPendingRewardWei = new BigNumber(
    contractCallResults.results.vrtVault.callsReturnContext[0].returnValues[0].hex,
  );

  if (vrtVaultPendingRewardWei.isGreaterThan(0)) {
    const vrtVaultRewardGroup: VaultPendingRewardGroup = {
      type: 'vault',
      stakedToken: TOKENS.vrt,
      rewardToken: TOKENS.vrt,
      rewardAmountWei: vrtVaultPendingRewardWei,
    };

    pendingRewardGroups.push(vrtVaultRewardGroup);
  }

  // Extract pending rewards from VAI vault
  const vaiVaultPendingRewardWei = new BigNumber(
    contractCallResults.results.vaiVault.callsReturnContext[0].returnValues[0].hex,
  );

  if (vaiVaultPendingRewardWei.isGreaterThan(0)) {
    const vaiVaultRewardGroup: VaultPendingRewardGroup = {
      type: 'vault',
<<<<<<< HEAD
      stakedToken: TOKENS.vai,
      rewardToken: TOKENS.xvs,
      rewardAmountWei: vaiVaultPendingRewardWei,
=======
      rewardToken: TOKENS.vrt,
      amountWei: vaiVaultPendingRewardWei,
>>>>>>> ecd594ea (add useGetPendingRewards hook)
    };

    pendingRewardGroups.push(vaiVaultRewardGroup);
  }

  // Extract pending rewards from vesting vaults
<<<<<<< HEAD
  const vestingVaultPendingRewardGroups: VaultPendingRewardGroup[] = [];
=======
  const vestingVaultPendingRewardGroups: VestingVaultPendingRewardGroup[] = [];
>>>>>>> ecd594ea (add useGetPendingRewards hook)
  const vestingVaultResults = contractCallResults.results.vestingVaults.callsReturnContext;

  for (let v = 0; v < vestingVaultResults.length - 1; v += 2) {
    const stakedTokenAddress = vestingVaultResults[v].returnValues[0];
    const stakedToken = getTokenByAddress(stakedTokenAddress);

    const pendingRewardWei = new BigNumber(vestingVaultResults[v + 1].returnValues[0].hex);

    if (stakedToken && pendingRewardWei.isGreaterThan(0)) {
      vestingVaultPendingRewardGroups.push({
        type: 'vestingVault',
        stakedToken,
        rewardToken: TOKENS.xvs,
<<<<<<< HEAD
        rewardAmountWei: pendingRewardWei,
=======
        amountWei: pendingRewardWei,
>>>>>>> ecd594ea (add useGetPendingRewards hook)
      });
    }
  }

  if (vestingVaultPendingRewardGroups.length > 0) {
    pendingRewardGroups.push(...vestingVaultPendingRewardGroups);
  }

  return pendingRewardGroups;
};

export default formatOutput;
