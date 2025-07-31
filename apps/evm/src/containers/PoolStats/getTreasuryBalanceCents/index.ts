import BigNumber from 'bignumber.js';
import type { Token, TokenBalance, VTokenBalance } from 'types';
import { convertMantissaToTokens } from 'utilities';
import type { Address } from 'viem';

export const getTreasuryBalanceCents = ({
  treasuryTokenBalances,
  treasuryVTokenBalances,
  tokenPriceMapping,
  vTokenExchangeRateMapping,
}: {
  treasuryTokenBalances: TokenBalance[];
  treasuryVTokenBalances: VTokenBalance[];
  tokenPriceMapping: {
    [tokenAddress: Address]: BigNumber;
  };
  vTokenExchangeRateMapping: {
    [tokenAddress: Address]: BigNumber;
  };
}) => {
  const calculateBalanceCents = ({
    token,
    amountTokens,
  }: { token: Token; amountTokens: BigNumber }) => {
    const tokenPriceCents = tokenPriceMapping[token.address.toLowerCase() as Address];
    const balanceCents = amountTokens.multipliedBy(tokenPriceCents ?? 0);
    return balanceCents;
  };

  let treasuryBalanceCents = new BigNumber(0);

  treasuryTokenBalances.forEach(treasuryTokenBalance => {
    const treasuryTokenBalanceTokens = convertMantissaToTokens({
      value: treasuryTokenBalance.balanceMantissa,
      token: treasuryTokenBalance.token,
    });

    treasuryBalanceCents = treasuryBalanceCents.plus(
      calculateBalanceCents({
        token: treasuryTokenBalance.token,
        amountTokens: treasuryTokenBalanceTokens,
      }),
    );
  });

  treasuryVTokenBalances.forEach(vTreasuryTokenBalance => {
    const treasuryVTokenBalanceTokens = convertMantissaToTokens({
      value: vTreasuryTokenBalance.balanceMantissa,
      token: vTreasuryTokenBalance.vToken,
    });

    const vTokenExchangeRate =
      vTokenExchangeRateMapping[vTreasuryTokenBalance.vToken.address.toLowerCase() as Address];

    const treasuryTokenBalanceTokens = treasuryVTokenBalanceTokens.div(vTokenExchangeRate);

    treasuryBalanceCents = treasuryBalanceCents.plus(
      calculateBalanceCents({
        token: vTreasuryTokenBalance.vToken.underlyingToken,
        amountTokens: treasuryTokenBalanceTokens,
      }),
    );
  });

  return treasuryBalanceCents;
};
