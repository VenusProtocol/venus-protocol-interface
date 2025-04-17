import type BigNumber from 'bignumber.js';

import type { Token } from 'types';
import convertDollarsToCents from 'utilities/convertDollarsToCents';
import convertMantissaToTokens from 'utilities/convertMantissaToTokens';

import type { Address } from 'viem';
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
  tokenPriceMapping: Record<Address, BigNumber>;
  stakedTokenSymbol: string;
  rewardTokenSymbol: string;
  tokens: Token[];
}) => {
  const stakedToken = tokens.find(token => token.symbol === stakedTokenSymbol);

  if (!stakedToken) {
    return;
  }

  const rewardToken = tokens.find(token => token.symbol === rewardTokenSymbol);

  if (!rewardToken) {
    return;
  }

  const rewardTokenPriceDollars = tokenPriceMapping[rewardToken.address.toLowerCase() as Address];
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
