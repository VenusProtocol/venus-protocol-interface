import BigNumber from 'bignumber.js';
import { ContractCallReturnContext } from 'ethereum-multicall';
import _cloneDeep from 'lodash/cloneDeep';
import { Token } from 'types';
import { calculateDailyDistributedTokens, getTokenByAddress } from 'utilities';

import { logError } from 'context/ErrorLogger';

export interface FormatDailyDistributedRewardTokensMappingInput {
  tokenPricesDollars: {
    [tokenAddress: string]: BigNumber;
  };
  rewardsDistributorsResults: ContractCallReturnContext[];
}
export interface DailyDistributedRewardTokensMapping {
  [vTokenAddress: string]: {
    rewardToken: Token;
    rewardTokenPriceDollars: BigNumber;
    supplyDailyDistributedRewardTokens: BigNumber;
    borrowDailyDistributedRewardTokens: BigNumber;
  }[];
}

const formatDailyDistributedRewardTokensMapping = ({
  rewardsDistributorsResults,
  tokenPricesDollars,
}: FormatDailyDistributedRewardTokensMappingInput) =>
  rewardsDistributorsResults.reduce<DailyDistributedRewardTokensMapping>(
    (acc, rewardsDistributorsResult) => {
      const results = rewardsDistributorsResult.callsReturnContext;
      const rewardTokenAddress = results[0].returnValues[0].toLowerCase();
      const rewardToken = getTokenByAddress(rewardTokenAddress);

      if (!rewardToken) {
        logError(`Record missing for reward token: ${rewardTokenAddress}`);
        return acc;
      }

      const rewardTokenPriceDollars = tokenPricesDollars[rewardTokenAddress];

      if (!rewardTokenPriceDollars) {
        logError(
          `Price could not be fetched for reward token: ${rewardToken.symbol} (${rewardToken.address})`,
        );
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
          const supplyDailyDistributedRewardTokens = calculateDailyDistributedTokens({
            mantissa: supplySpeedMantissa,
            decimals: rewardToken.decimals,
          });

          const borrowDailyDistributedRewardTokens = calculateDailyDistributedTokens({
            mantissa: borrowSpeedMantissa,
            decimals: rewardToken.decimals,
          });

          // Initialize with an empty array if necessary
          accCopy[vTokenAddress] = accCopy[vTokenAddress] || [];
          accCopy[vTokenAddress].push({
            rewardToken,
            rewardTokenPriceDollars,
            supplyDailyDistributedRewardTokens,
            borrowDailyDistributedRewardTokens,
          });
        }
      }

      return accCopy;
    },
    {},
  );

export default formatDailyDistributedRewardTokensMapping;
