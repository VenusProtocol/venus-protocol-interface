import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';
import { Token } from 'types';

import {
  PendingRewardGroup,
  VaultPendingRewardGroup,
  XvsVestingVaultPendingRewardGroup,
} from '../types';
import formatToIsolatedPoolPendingRewardGroup from './formatToIsolatedPoolPendingRewardGroup';
import formatToMainPoolPendingRewardGroup from './formatToMainPoolPendingRewardGroup';

const formatOutput = ({
  tokens,
  mainPoolComptrollerContractAddress,
  vaiVaultPendingXvsResult,
  isolatedPoolsPendingRewardsResults,
  xvsVestingVaultPoolInfosResults,
  xvsVestingVaultPendingRewardResults,
  xvsVestingVaultPendingWithdrawalsBeforeUpgradeResults,
  rewardTokenPriceMapping,
  venusLensPendingRewardsResult,
}: {
  tokens: Token[];
  vaiVaultPendingXvsResult: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'vaiVault'>['pendingXVS']>>
  >;
  isolatedPoolsPendingRewardsResults: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'poolLens'>['getPendingRewards']>>
  >[];
  xvsVestingVaultPoolInfosResults: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'xvsVault'>['poolInfos']>>
  >[];
  xvsVestingVaultPendingRewardResults: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'xvsVault'>['pendingReward']>>
  >[];
  xvsVestingVaultPendingWithdrawalsBeforeUpgradeResults: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'xvsVault'>['pendingWithdrawalsBeforeUpgrade']>>
  >[];
  rewardTokenPriceMapping: Record<string, BigNumber>;
  venusLensPendingRewardsResult: PromiseSettledResult<
    Awaited<ReturnType<ContractTypeByName<'venusLens'>['pendingRewards']>> | undefined
  >;
  mainPoolComptrollerContractAddress?: string;
}): PendingRewardGroup[] => {
  const pendingRewardGroups: PendingRewardGroup[] = [];

  // Extract pending rewards from main pool
  const mainPoolPendingRewardGroup = mainPoolComptrollerContractAddress
    ? formatToMainPoolPendingRewardGroup({
        venusLensPendingRewardsResult,
        rewardTokenPriceMapping,
        comptrollerContractAddress: mainPoolComptrollerContractAddress,
        tokens,
      })
    : undefined;

  if (mainPoolPendingRewardGroup) {
    pendingRewardGroups.push(mainPoolPendingRewardGroup);
  }

  // // Extract pending rewards from isolated pools
  // const isolatedPoolPendingRewardGroups = (
  //   contractCallResults.results.poolLens?.callsReturnContext || []
  // ).reduce<PendingRewardGroup[]>((acc, callsReturnContext) => {
  //   const isolatedPoolPendingRewardGroup = formatToIsolatedPoolPendingRewardGroup(
  //     callsReturnContext,
  //     rewardTokenPrices,
  //   );

  //   return isolatedPoolPendingRewardGroup ? [...acc, isolatedPoolPendingRewardGroup] : acc;
  // }, []);
  // pendingRewardGroups.push(...isolatedPoolPendingRewardGroups);

  // // Extract pending rewards from VAI vault
  // const vaiVaultPendingRewardWei = new BigNumber(
  //   contractCallResults.results.vaiVault.callsReturnContext[0].returnValues[0].hex,
  // );

  // const xvsTokenPriceDollars = rewardTokenPrices[TOKENS.xvs.address.toLowerCase()];
  // const xvsTokenPriceCents = convertDollarsToCents(xvsTokenPriceDollars);

  // const vaiVaultPendingRewardTokens = convertWeiToTokens({
  //   valueWei: vaiVaultPendingRewardWei,
  //   token: TOKENS.xvs,
  // });

  // const vaiVaultPendingRewardAmountCents =
  //   vaiVaultPendingRewardTokens.multipliedBy(xvsTokenPriceCents);

  // if (vaiVaultPendingRewardWei.isGreaterThan(0)) {
  //   const vaiVaultRewardGroup: VaultPendingRewardGroup = {
  //     type: 'vault',
  //     stakedToken: TOKENS.vai,
  //     rewardToken: TOKENS.xvs,
  //     rewardAmountWei: vaiVaultPendingRewardWei,
  //     rewardAmountCents: vaiVaultPendingRewardAmountCents,
  //   };

  //   pendingRewardGroups.push(vaiVaultRewardGroup);
  // }

  // // Extract pending rewards from vesting vaults
  // const xvsVestingVaultPendingRewardGroups: XvsVestingVaultPendingRewardGroup[] = [];
  // const xvsVestingVaultResults = contractCallResults.results.xvsVestingVaults.callsReturnContext;

  // for (let v = 0; v < xvsVestingVaultResults.length - 1; v += 3) {
  //   const stakedTokenAddress = xvsVestingVaultResults[v].returnValues[0];
  //   const stakedToken = getTokenByAddress(stakedTokenAddress);

  //   const poolIndex = xvsVestingVaultResults[v].methodParameters[1];

  //   const pendingRewardWei = new BigNumber(xvsVestingVaultResults[v + 1].returnValues[0].hex);

  //   const hasPendingWithdrawalsFromBeforeUpgrade =
  //     !!xvsVestingVaultResults[v + 2].returnValues[0] &&
  //     new BigNumber(xvsVestingVaultResults[v + 2].returnValues[0].hex).isGreaterThan(0);

  //   if (
  //     !hasPendingWithdrawalsFromBeforeUpgrade &&
  //     stakedToken &&
  //     pendingRewardWei.isGreaterThan(0)
  //   ) {
  //     const pendingRewardTokens = convertWeiToTokens({
  //       valueWei: pendingRewardWei,
  //       token: TOKENS.xvs,
  //     });
  //     const xvsVestingVaultPendingRewardCents =
  //       pendingRewardTokens.multipliedBy(xvsTokenPriceCents);

  //     xvsVestingVaultPendingRewardGroups.push({
  //       type: 'xvsVestingVault',
  //       poolIndex,
  //       rewardToken: TOKENS.xvs,
  //       rewardAmountWei: pendingRewardWei,
  //       rewardAmountCents: xvsVestingVaultPendingRewardCents,
  //     });
  //   }
  // }

  // if (xvsVestingVaultPendingRewardGroups.length > 0) {
  //   pendingRewardGroups.push(...xvsVestingVaultPendingRewardGroups);
  // }

  return pendingRewardGroups;
};

export default formatOutput;
