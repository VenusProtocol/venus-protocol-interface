import BigNumber from 'bignumber.js';
import { ContractCallResults } from 'ethereum-multicall';
import { getTokenByAddress } from 'utilities';

import { TOKENS } from 'constants/tokens';

import {
  PendingRewardGroup,
  VaultPendingRewardGroup,
  XvsVestingVaultPendingRewardGroup,
} from '../types';
import formatToIsolatedPoolPendingRewardGroup from './formatToIsolatedPoolPendingRewardGroup';
import formatToMainPoolPendingRewardGroup from './formatToMainPoolPendingRewardGroup';

const formatOutput = ({
  contractCallResults,
}: {
  contractCallResults: ContractCallResults;
}): PendingRewardGroup[] => {
  const pendingRewardGroups: PendingRewardGroup[] = [];

  // Extract pending rewards from main pool
  const mainPoolPendingRewardGroup = formatToMainPoolPendingRewardGroup(
    contractCallResults.results.venusLens.callsReturnContext[0],
  );

  if (mainPoolPendingRewardGroup) {
    pendingRewardGroups.push(mainPoolPendingRewardGroup);
  }

  // Extract pending rewards from isolated pools
  const isolatedPoolPendingRewardGroups = (
    contractCallResults.results.poolLens?.callsReturnContext
      // Ignore last call result as it is the oracle address
      .slice(0, -1) || []
  ).reduce<PendingRewardGroup[]>((acc, callsReturnContext) => {
    const isolatedPoolPendingRewardGroup =
      formatToIsolatedPoolPendingRewardGroup(callsReturnContext);

    return isolatedPoolPendingRewardGroup ? [...acc, isolatedPoolPendingRewardGroup] : acc;
  }, []);

  pendingRewardGroups.push(...isolatedPoolPendingRewardGroups);

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
      stakedToken: TOKENS.vai,
      rewardToken: TOKENS.xvs,
      rewardAmountWei: vaiVaultPendingRewardWei,
    };

    pendingRewardGroups.push(vaiVaultRewardGroup);
  }

  // Extract pending rewards from vesting vaults
  const xvsVestingVaultPendingRewardGroups: XvsVestingVaultPendingRewardGroup[] = [];
  const xvsVestingVaultResults = contractCallResults.results.xvsVestingVaults.callsReturnContext;

  for (let v = 0; v < xvsVestingVaultResults.length - 1; v += 2) {
    const stakedTokenAddress = xvsVestingVaultResults[v].returnValues[0];
    const stakedToken = getTokenByAddress(stakedTokenAddress);

    const poolIndex = xvsVestingVaultResults[v].methodParameters[1];

    const pendingRewardWei = new BigNumber(xvsVestingVaultResults[v + 1].returnValues[0].hex);

    if (stakedToken && pendingRewardWei.isGreaterThan(0)) {
      xvsVestingVaultPendingRewardGroups.push({
        type: 'xvsVestingVault',
        poolIndex,
        rewardToken: TOKENS.xvs,
        rewardAmountWei: pendingRewardWei,
      });
    }
  }

  if (xvsVestingVaultPendingRewardGroups.length > 0) {
    pendingRewardGroups.push(...xvsVestingVaultPendingRewardGroups);
  }

  return pendingRewardGroups;
};

export default formatOutput;
