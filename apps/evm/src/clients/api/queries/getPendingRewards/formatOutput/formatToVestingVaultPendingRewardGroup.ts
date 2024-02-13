import BigNumber from 'bignumber.js';

import { logError } from 'libs/errors';
import { Token } from 'types';
import convertDollarsToCents from 'utilities/convertDollarsToCents';
import convertMantissaToTokens from 'utilities/convertMantissaToTokens';
import findTokenByAddress from 'utilities/findTokenByAddress';

import { XvsVestingVaultPendingRewardGroup } from '../types';

const formatToVestingVaultPendingRewardGroup = ({
  poolIndex,
  isDisabled,
  userPendingRewardsAmountMantissa,
  userPendingWithdrawalsBeforeUpgradeAmountMantissa,
  tokenPriceMapping,
  tokens,
  stakedTokenAddress,
}: {
  poolIndex: number;
  isDisabled: boolean;
  userPendingRewardsAmountMantissa: BigNumber;
  userPendingWithdrawalsBeforeUpgradeAmountMantissa: BigNumber;
  tokenPriceMapping: Record<string, BigNumber>;
  tokens: Token[];
  stakedTokenAddress: string;
}) => {
  const hasPendingWithdrawalsFromBeforeUpgrade =
    userPendingWithdrawalsBeforeUpgradeAmountMantissa.toNumber() > 0;

  // Return undefined if user has pending withdrawal requests from before the contract upgrade,
  // meaning they first need to execute their withdrawals before they can do anything with this
  // vault
  if (hasPendingWithdrawalsFromBeforeUpgrade) {
    return;
  }

  const rewardToken = tokens.find(token => token.symbol === 'XVS');

  if (!rewardToken) {
    logError('Record missing for reward token: XVS');
    return;
  }

  const stakedToken = findTokenByAddress({
    address: stakedTokenAddress,
    tokens,
  });

  if (!stakedToken) {
    logError(`Record missing for staked token: ${stakedTokenAddress}`);
    return;
  }

  const rewardTokenPriceDollars = tokenPriceMapping[rewardToken.address.toLowerCase()];

  // Return if there is no available reward token price
  if (!rewardTokenPriceDollars) {
    return;
  }

  const rewardTokenPriceCents = convertDollarsToCents(rewardTokenPriceDollars);

  const pendingRewardAmountTokens = convertMantissaToTokens({
    value: userPendingRewardsAmountMantissa,
    token: rewardToken,
  });

  const pendingRewardAmountCents = pendingRewardAmountTokens.multipliedBy(rewardTokenPriceCents);

  if (pendingRewardAmountTokens.isEqualTo(0)) {
    return;
  }

  const vaiVaultRewardGroup: XvsVestingVaultPendingRewardGroup = {
    type: 'xvsVestingVault',
    isDisabled,
    poolIndex,
    stakedToken,
    rewardToken,
    rewardAmountMantissa: userPendingRewardsAmountMantissa,
    rewardAmountCents: pendingRewardAmountCents,
  };

  return vaiVaultRewardGroup;
};

export default formatToVestingVaultPendingRewardGroup;
