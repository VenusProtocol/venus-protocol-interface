import type { LiquidityHubTx, LiquidityHubTxType } from 'types';
import {
  convertDollarsToCents,
  convertMantissaToTokens,
  convertPriceMantissaToDollars,
} from 'utilities';
import type { Address } from 'viem';
import type { ApiAccountHistoricalTransaction, VhTokenMapping } from '../../types';

export const formatToLiquidityHubTransaction = ({
  vhTokenMapping,
  apiTransaction,
  txType,
}: {
  vhTokenMapping: VhTokenMapping;
  apiTransaction: ApiAccountHistoricalTransaction;
  txType: LiquidityHubTxType;
}): LiquidityHubTx | undefined => {
  const {
    txHash: hash,
    txTimestamp: blockTimestamp,
    blockNumber,
    accountAddress,
    contractAddress,
    chainId,
    amountUnderlyingMantissa,
    underlyingTokenPriceMantissa,
  } = apiTransaction;

  const vhToken = vhTokenMapping[contractAddress.toLowerCase() as Address];
  if (!vhToken) {
    return undefined;
  }

  const token = vhToken.underlyingToken;
  const amountTokens = amountUnderlyingMantissa
    ? convertMantissaToTokens({
        value: BigInt(amountUnderlyingMantissa),
        token,
      })
    : undefined;

  const tokenPriceDollars = underlyingTokenPriceMantissa
    ? convertPriceMantissaToDollars({
        priceMantissa: underlyingTokenPriceMantissa,
        decimals: token.decimals,
      })
    : undefined;

  const tokenPriceCents = tokenPriceDollars ? convertDollarsToCents(tokenPriceDollars) : undefined;
  const amounts =
    amountTokens && tokenPriceCents
      ? [
          {
            token,
            amountTokens,
            amountCents: amountTokens.multipliedBy(tokenPriceCents).toNumber(),
          },
        ]
      : undefined;

  return {
    txType,
    hash,
    blockTimestamp,
    blockNumber,
    accountAddress,
    contractAddress,
    chainId,
    vhToken,
    amounts,
  };
};
