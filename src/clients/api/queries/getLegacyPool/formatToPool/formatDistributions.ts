import BigNumber from 'bignumber.js';

import { AssetDistribution, Token, VToken } from 'types';
import { formatRewardDistribution, multiplyMantissaDaily } from 'utilities';

export interface FormatDistributionsInput {
  blocksPerDay: number;
  xvsSpeedMantissa: BigNumber;
  balanceDollars: BigNumber;
  xvsPriceDollars: BigNumber;
  xvs: Token;
  vToken: VToken;
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
  const dailyDistributedXvs = multiplyMantissaDaily({
    mantissa: xvsSpeedMantissa,
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

  if (primeApy) {
    const primeDistribution: AssetDistribution = {
      type: 'prime',
      apyPercentage: primeApy,
      token: vToken.underlyingToken,
    };

    distributions.push(primeDistribution);
  }

  return distributions;
};
