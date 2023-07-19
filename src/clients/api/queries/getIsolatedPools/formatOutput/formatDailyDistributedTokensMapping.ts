import BigNumber from 'bignumber.js';
import { ContractCallReturnContext } from 'ethereum-multicall';
import _cloneDeep from 'lodash/cloneDeep';
import { Token } from 'types';
import { calculateDailyDistributedTokens, getTokenByAddress } from 'utilities';

import { logError } from 'context/ErrorLogger';

export interface FormatDailyDistributedTokensMappingInput {
  tokenPricesDollars: {
    [tokenAddress: string]: BigNumber;
  };
  rewardsDistributorsResults: ContractCallReturnContext[];
}
export interface DailyDistributedTokensMapping {
  [vTokenAddress: string]: {
    token: Token;
    tokenPriceDollars: BigNumber;
    supplyDailyDistributedTokens: BigNumber;
    borrowDailyDistributedTokens: BigNumber;
  }[];
}

const formatDailyDistributedTokensMapping = ({
  rewardsDistributorsResults,
  tokenPricesDollars,
}: FormatDailyDistributedTokensMappingInput) =>
  rewardsDistributorsResults.reduce<DailyDistributedTokensMapping>(
    (acc, rewardsDistributorsResult) => {
      const results = rewardsDistributorsResult.callsReturnContext;
      const rewardTokenAddress = results[0].returnValues[0].toLowerCase();
      const rewardToken = getTokenByAddress(rewardTokenAddress);

      if (!rewardToken) {
        logError(`Record missing for reward token: ${rewardTokenAddress}`);
        return acc;
      }

      const rewardTokenPricesDollars = tokenPricesDollars[rewardToken.address.toLowerCase()];

      if (!rewardTokenPricesDollars) {
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
          // TODO: check if this needs to be calculated using the decimals of the reward token
          // rather than always 18 decimals
          const supplyDailyDistributedTokens = calculateDailyDistributedTokens({
            ratePerBlockMantissa: supplySpeedMantissa,
          });

          // TODO: check if this needs to be calculated using the decimals of the reward token
          // rather than always 18 decimals
          const borrowDailyDistributedTokens = calculateDailyDistributedTokens({
            ratePerBlockMantissa: borrowSpeedMantissa,
          });

          // Initialize with an empty array if necessary
          accCopy[vTokenAddress] = accCopy[vTokenAddress] || [];
          accCopy[vTokenAddress].push({
            token: rewardToken,
            tokenPriceDollars: tokenPricesDollars[rewardToken.address.toLowerCase()],
            supplyDailyDistributedTokens,
            borrowDailyDistributedTokens,
          });
        }
      }

      return accCopy;
    },
    {},
  );

export default formatDailyDistributedTokensMapping;
