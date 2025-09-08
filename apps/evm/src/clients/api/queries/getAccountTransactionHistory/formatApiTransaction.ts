import { type Token, TxType } from 'types';
import {
  convertDollarsToCents,
  convertMantissaToTokens,
  convertPriceMantissaToDollars,
} from 'utilities';
import type { Address } from 'viem';
import type { AmountTransaction, ApiAccountHistoricalTransaction } from './types';

export const formatApiTransaction = ({
  contractToTokenMap,
  apiTransaction,
}: {
  contractToTokenMap: Record<
    Address,
    {
      token: Token;
      poolName: string;
    }
  >;
  apiTransaction: ApiAccountHistoricalTransaction;
}): AmountTransaction => {
  const {
    txType,
    txHash: hash,
    txTimestamp,
    blockNumber,
    accountAddress,
    contractAddress,
    chainId,
    amountUnderlyingMantissa,
    underlyingTokenPriceMantissa,
  } = apiTransaction;

  const { poolName, token } = contractToTokenMap[contractAddress];

  const canCalculateUsdAmount =
    txType !== TxType.Approve && txType !== TxType.EnterMarket && txType !== TxType.ExitMarket;

  const amountTokens = amountUnderlyingMantissa
    ? convertMantissaToTokens({
        value: BigInt(amountUnderlyingMantissa),
        token: token,
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
  const amountCents =
    amountTokens && tokenPriceCents ? amountTokens.multipliedBy(tokenPriceCents) : undefined;

  return {
    txType,
    hash,
    blockTimestamp: txTimestamp,
    blockNumber,
    accountAddress,
    contractAddress,
    chainId,
    poolName,
    amountTokens,
    amountCents,
    token,
  };
};
