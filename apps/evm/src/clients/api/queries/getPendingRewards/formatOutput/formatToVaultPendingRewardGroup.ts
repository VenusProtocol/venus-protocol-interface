import type BigNumber from 'bignumber.js';

import { logError } from 'libs/errors';
import type { Token } from 'types';
import convertDollarsToCents from 'utilities/convertDollarsToCents';
import convertMantissaToTokens from 'utilities/convertMantissaToTokens';

import type { VaultPendingRewardGroup } from '../types';

const formatToVaultPendingRewardGroup = ({
  isDisabled,
  pendingRewardAmountMantissa,
  tokenPriceMapping,
  stakedTokenSymbol,
  rewardTokenSymbol,
  tokens,
}: {
  isDisabled: boolean;
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
    isDisabled,
    stakedToken,
    rewardToken,
    rewardAmountMantissa: pendingRewardAmountMantissa,
    rewardAmountCents: pendingRewardAmountCents,
  };

  return vaiVaultRewardGroup;
};

export default formatToVaultPendingRewardGroup;
