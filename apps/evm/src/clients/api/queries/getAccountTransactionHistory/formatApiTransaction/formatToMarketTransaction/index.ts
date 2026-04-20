import type { MarketTx, MarketTxType } from 'types';
import {
  convertDollarsToCents,
  convertMantissaToTokens,
  convertPriceMantissaToDollars,
} from 'utilities';
import type { Address } from 'viem';
import type { ApiAccountHistoricalTransaction, VTokenAssetMapping } from '../../types';

export const formatToMarketTransaction = ({
  vTokenAssetMapping,
  apiTransaction,
  txType,
}: {
  vTokenAssetMapping: VTokenAssetMapping;
  apiTransaction: ApiAccountHistoricalTransaction;
  txType: MarketTxType;
}): MarketTx | undefined => {
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

  const asset = vTokenAssetMapping[contractAddress.toLowerCase() as Address];
  if (!asset) {
    return undefined;
  }

  const { poolName, vToken } = asset;
  const token = vToken.underlyingToken;
  const canCalculateUsdAmount = txType !== 'enterMarket' && txType !== 'exitMarket';

  const amountTokens = amountUnderlyingMantissa
    ? convertMantissaToTokens({
        value: BigInt(amountUnderlyingMantissa),
        token,
      })
    : undefined;

  const tokenPriceDollars =
    canCalculateUsdAmount && underlyingTokenPriceMantissa
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

  const transaction: MarketTx = {
    txType,
    hash,
    blockTimestamp,
    blockNumber,
    accountAddress,
    contractAddress,
    chainId,
    poolName,
    vToken,
    amounts,
  };

  return transaction;
};
