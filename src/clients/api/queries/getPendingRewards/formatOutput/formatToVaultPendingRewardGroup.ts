import BigNumber from 'bignumber.js';
import { logError } from 'errors';
import { Token } from 'types';

import convertDollarsToCents from 'utilities/convertDollarsToCents';
import convertMantissaToTokens from 'utilities/convertMantissaToTokens';

import { VaultPendingRewardGroup } from '../types';

const formatToVaultPendingRewardGroup = ({
  pendingRewardAmountMantissa,
  tokenPriceMapping,
  stakedTokenSymbol,
  rewardTokenSymbol,
  tokens,
}: {
  pendingRewardAmountMantissa: BigNumber;
  tokenPriceMapping: Record<string, BigNumber>;
  stakedTokenSymbol: string;
  rewardTokenSymbol: string;
  tokens: Token[];
}) => {
  const stakedToken = tokens.find(token => token.symbol === stakedTokenSymbol);

  if (!stakedToken) {
    logError(`Record missing for staked token: ${stakedTokenSymbol}`);
    return;
  }

  const rewardToken = tokens.find(token => token.symbol === rewardTokenSymbol);

  if (!rewardToken) {
    logError(`Record missing for reward token: ${rewardTokenSymbol}`);
    return;
  }

  const rewardTokenPriceDollars = tokenPriceMapping[rewardToken.address.toLowerCase()];
  const rewardTokenPriceCents = convertDollarsToCents(rewardTokenPriceDollars);

  const pendingRewardAmountTokens = convertMantissaToTokens({
    value: pendingRewardAmountMantissa,
    token: stakedToken,
  });

  const pendingRewardAmountCents = pendingRewardAmountTokens.multipliedBy(rewardTokenPriceCents);

  if (pendingRewardAmountTokens.isEqualTo(0)) {
    return;
  }

  const vaiVaultRewardGroup: VaultPendingRewardGroup = {
    type: 'vault',
    stakedToken,
    rewardToken,
    rewardAmountMantissa: pendingRewardAmountMantissa,
    rewardAmountCents: pendingRewardAmountCents,
  };

  return vaiVaultRewardGroup;
};

export default formatToVaultPendingRewardGroup;
