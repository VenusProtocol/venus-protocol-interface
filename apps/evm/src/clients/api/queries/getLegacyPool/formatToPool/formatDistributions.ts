import type BigNumber from 'bignumber.js';

import type { AssetDistribution, Token, VToken } from 'types';
import { calculateDailyTokenRate, formatRewardDistribution } from 'utilities';

export interface FormatDistributionsInput {
  xvsSpeedMantissa: BigNumber;
  balanceDollars: BigNumber;
  xvsPriceDollars: BigNumber;
  xvs: Token;
  vToken: VToken;
  blocksPerDay?: number;
  primeApy?: BigNumber;
}

export const formatDistributions = ({
  blocksPerDay,
  xvsSpeedMantissa,
  balanceDollars,
  xvsPriceDollars,
  xvs,
  vToken,
  primeApy,
}: FormatDistributionsInput) => {
  const dailyDistributedXvs = calculateDailyTokenRate({
    rateMantissa: xvsSpeedMantissa,
    decimals: xvs.decimals,
    blocksPerDay,
  });

  const xvsDistribution = formatRewardDistribution({
    rewardToken: xvs,
    rewardTokenPriceDollars: xvsPriceDollars,
    dailyDistributedRewardTokens: dailyDistributedXvs,
    balanceDollars,
  });

  const distributions: AssetDistribution[] = [xvsDistribution];

  if (primeApy && !primeApy.isEqualTo(0)) {
    const primeDistribution: AssetDistribution = {
      type: 'prime',
      apyPercentage: primeApy,
      token: vToken.underlyingToken,
    };

    distributions.push(primeDistribution);
  }

  return distributions;
};
