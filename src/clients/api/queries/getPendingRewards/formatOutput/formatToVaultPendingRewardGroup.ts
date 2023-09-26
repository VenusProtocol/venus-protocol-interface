import BigNumber from 'bignumber.js';
import { Token } from 'types';
import { convertDollarsToCents, convertWeiToTokens } from 'utilities';

import { logError } from 'context/ErrorLogger';

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

  const pendingRewardAmountTokens = convertWeiToTokens({
    valueWei: pendingRewardAmountMantissa,
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
    rewardAmountWei: pendingRewardAmountMantissa,
    rewardAmountCents: pendingRewardAmountCents,
  };

  return vaiVaultRewardGroup;
};

export default formatToVaultPendingRewardGroup;
