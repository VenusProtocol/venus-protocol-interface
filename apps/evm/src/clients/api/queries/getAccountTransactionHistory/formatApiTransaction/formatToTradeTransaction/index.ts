import type { Address } from 'viem';

import type { TradeTx, TradeTxType, TxAmount } from 'types';
import type { ApiAccountHistoricalTransaction, VTokenAssetMapping } from '../../types';
import { formatToAmount } from './formatToAmount';

export const formatToTradeTransaction = ({
  vTokenAssetMapping,
  apiTransaction,
  txType,
}: {
  vTokenAssetMapping: VTokenAssetMapping;
  apiTransaction: ApiAccountHistoricalTransaction;
  txType: TradeTxType;
}) => {
  const {
    txHash: hash,
    txTimestamp: blockTimestamp,
    blockNumber,
    accountAddress,
    contractAddress,
    chainId,
    tradeLongVTokenAddress,
    tradeShortVTokenAddress,
    tradeDsaVTokenAddress,
    tradePrincipalAmountMantissa,
    tradeShortAmountMantissa,
    tradeLongAmountMantissa,
    tradeAmountRepaidMantissa,
    tradeAmountRedeemedMantissa,
    tradeAmountRedeemedDsaMantissa,
    tradeDsaProfitAmountMantissa,
    tradeCycleId,
  } = apiTransaction;

  const amounts: TxAmount[] = [];

  const dsaPoolAsset = tradeDsaVTokenAddress
    ? vTokenAssetMapping[tradeDsaVTokenAddress.toLowerCase() as Address]
    : undefined;

  const shortPoolAsset = tradeShortVTokenAddress
    ? vTokenAssetMapping[tradeShortVTokenAddress.toLowerCase() as Address]
    : undefined;

  const longPoolAsset = tradeLongVTokenAddress
    ? vTokenAssetMapping[tradeLongVTokenAddress.toLowerCase() as Address]
    : undefined;

  if (tradePrincipalAmountMantissa && Number(tradePrincipalAmountMantissa) > 0 && dsaPoolAsset) {
    amounts.push(
      formatToAmount({
        asset: dsaPoolAsset,
        amountMantissa: tradePrincipalAmountMantissa,
      }),
    );
  }

  if (
    tradeAmountRedeemedDsaMantissa &&
    Number(tradeAmountRedeemedDsaMantissa) > 0 &&
    dsaPoolAsset
  ) {
    amounts.push(
      formatToAmount({
        asset: dsaPoolAsset,
        amountMantissa: BigInt(tradeAmountRedeemedDsaMantissa) * -1n,
      }),
    );
  }

  if (tradeDsaProfitAmountMantissa && Number(tradeDsaProfitAmountMantissa) > 0 && dsaPoolAsset) {
    amounts.push(
      formatToAmount({
        asset: dsaPoolAsset,
        amountMantissa: tradeDsaProfitAmountMantissa,
      }),
    );
  }

  if (tradeLongAmountMantissa && Number(tradeLongAmountMantissa) > 0 && longPoolAsset) {
    amounts.push(
      formatToAmount({
        asset: longPoolAsset,
        amountMantissa: tradeLongAmountMantissa,
      }),
    );
  }

  if (tradeAmountRedeemedMantissa && Number(tradeAmountRedeemedMantissa) > 0 && longPoolAsset) {
    amounts.push(
      formatToAmount({
        asset: longPoolAsset,
        amountMantissa: BigInt(tradeAmountRedeemedMantissa) * -1n,
      }),
    );
  }

  if (tradeShortAmountMantissa && Number(tradeShortAmountMantissa) > 0 && shortPoolAsset) {
    amounts.push(
      formatToAmount({
        asset: shortPoolAsset,
        amountMantissa: tradeShortAmountMantissa,
      }),
    );
  }

  if (tradeAmountRepaidMantissa && Number(tradeAmountRepaidMantissa) > 0 && shortPoolAsset) {
    amounts.push(
      formatToAmount({
        asset: shortPoolAsset,
        amountMantissa: BigInt(tradeAmountRepaidMantissa) * -1n,
      }),
    );
  }

  const transaction: TradeTx = {
    cycleId: tradeCycleId || '1',
    txType,
    hash,
    blockTimestamp,
    blockNumber,
    accountAddress,
    contractAddress,
    chainId,
    amounts,
  };

  return transaction;
};
