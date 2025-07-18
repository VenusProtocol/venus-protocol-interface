import BigNumber from 'bignumber.js';
import type { Asset, TokenBalance, VTokenBalance } from 'types';
import { convertMantissaToTokens } from 'utilities';

export const getAssetTreasuryBalanceCents = ({
  asset,
  treasuryTokenBalances,
  treasuryVTokenBalances,
}: {
  asset: Asset;
  treasuryTokenBalances: Record<string, TokenBalance>;
  treasuryVTokenBalances: Record<string, VTokenBalance>;
}) => {
  const treasuryTokenBalance = treasuryTokenBalances[
    asset.vToken.underlyingToken.address.toLowerCase()
  ] as TokenBalance | undefined;

  const treasuryVTokenBalance = treasuryVTokenBalances[asset.vToken.address.toLowerCase()] as
    | VTokenBalance
    | undefined;

  const assetTreasuryBalanceMantissa = treasuryTokenBalance?.balanceMantissa || new BigNumber(0);

  let assetTreasuryBalanceTokens = convertMantissaToTokens({
    value: assetTreasuryBalanceMantissa,
    token: asset.vToken.underlyingToken,
  });

  // Add underlying balance of treasury vTokens
  if (treasuryVTokenBalance) {
    const treasuryVTokenBalanceTokens = convertMantissaToTokens({
      value: treasuryVTokenBalance.balanceMantissa,
      token: treasuryVTokenBalance.vToken,
    });

    const assetTreasuryUnderlyingBalanceTokens = treasuryVTokenBalanceTokens
      .dividedBy(asset.exchangeRateVTokens)
      .toFixed(0);

    assetTreasuryBalanceTokens = assetTreasuryBalanceTokens.plus(
      assetTreasuryUnderlyingBalanceTokens,
    );
  }

  const assetTreasuryBalanceCents = assetTreasuryBalanceTokens
    .multipliedBy(asset.tokenPriceCents)
    .toNumber();

  return assetTreasuryBalanceCents;
};
