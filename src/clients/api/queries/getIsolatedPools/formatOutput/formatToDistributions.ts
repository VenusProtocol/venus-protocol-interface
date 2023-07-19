import BigNumber from 'bignumber.js';
import { ContractCallReturnContext } from 'ethereum-multicall';
import _cloneDeep from 'lodash/cloneDeep';
import { AssetDistribution } from 'types';
import { calculateApy, calculateDailyDistributedTokens, getTokenByAddress } from 'utilities';

import { logError } from 'context/ErrorLogger';

export interface FormatToDistributionsInput {
  tokenPricesDollars: {
    [tokenAddress: string]: BigNumber;
  };
  rewardsDistributorsResults: ContractCallReturnContext[];
}

const formatToDistributions = ({
  rewardsDistributorsResults,
}: // tokenPricesDollars,
FormatToDistributionsInput) =>
  rewardsDistributorsResults.reduce<{
    [vTokenAddress: string]: AssetDistribution[];
  }>((acc, rewardsDistributorsResult) => {
    const results = rewardsDistributorsResult.callsReturnContext;
    const rewardTokenAddress = results[0].returnValues[0].toLowerCase();
    const rewardToken = getTokenByAddress(rewardTokenAddress);

    if (!rewardToken) {
      logError(`Record missing for reward token: ${rewardTokenAddress}`);
      return acc;
    }

    const speedResults = results.slice(1);
    const accCopy = _cloneDeep(acc);

    for (let r = 0; r < speedResults.length - 1; r += 2) {
      const vTokenAddress = speedResults[r].methodParameters[0].toLowerCase();
      const supplySpeedMantissa = new BigNumber(speedResults[r].returnValues[0].hex);
      const borrowSpeedMantissa = new BigNumber(speedResults[r + 1].returnValues[0].hex);

      // Only add distribution if one of the speeds is not 0
      if (supplySpeedMantissa.isGreaterThan(0) || borrowSpeedMantissa.isGreaterThan(0)) {
        const supplyDailyDistributedTokens = calculateDailyDistributedTokens({
          ratePerBlockMantissa: supplySpeedMantissa,
          decimals: rewardToken.decimals,
        });

        const supplyApyPercentage = calculateApy({
          dailyDistributedTokens: supplyDailyDistributedTokens,
          decimals: rewardToken.decimals,
        });

        const borrowDailyDistributedTokens = calculateDailyDistributedTokens({
          ratePerBlockMantissa: borrowSpeedMantissa,
          decimals: rewardToken.decimals,
        });

        const borrowApyPercentage = calculateApy({
          dailyDistributedTokens: borrowDailyDistributedTokens,
          decimals: rewardToken.decimals,
        });

        // Initialize with an empty array if necessary
        accCopy[vTokenAddress] = accCopy[vTokenAddress] || [];
        accCopy[vTokenAddress].push({
          token: rewardToken,
          supplyApyPercentage,
          borrowApyPercentage,
          supplyDailyDistributedTokens,
          borrowDailyDistributedTokens,
        });
      }
    }

    return accCopy;
  }, {});

export default formatToDistributions;
