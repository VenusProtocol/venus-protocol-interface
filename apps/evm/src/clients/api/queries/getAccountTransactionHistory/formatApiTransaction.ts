import { TxType, type VToken } from 'types';
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
      vToken: VToken;
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

  const { poolName, vToken } = contractToTokenMap[contractAddress];

  const isApproval = txType === TxType.Approve;

  const vTokenSymbol = vToken.symbol;
  const token = isApproval ? vToken : vToken.underlyingToken;

  const canCalculateUsdAmount =
    !isApproval && txType !== TxType.EnterMarket && txType !== TxType.ExitMarket;

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
    vTokenSymbol,
    amountTokens,
    amountCents,
    token,
  };
};
