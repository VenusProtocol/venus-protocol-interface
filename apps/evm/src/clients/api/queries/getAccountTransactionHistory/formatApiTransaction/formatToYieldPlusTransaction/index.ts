import type { Address } from 'viem';

import type { TxAmount, YieldPlusTx, YieldPlusTxType } from 'types';
import type { ApiAccountHistoricalTransaction, VTokenAssetMapping } from '../../types';
import { formatToAmount } from './formatToAmount';

export const formatToYieldPlusTransaction = ({
  vTokenAssetMapping,
  apiTransaction,
  txType,
}: {
  vTokenAssetMapping: VTokenAssetMapping;
  apiTransaction: ApiAccountHistoricalTransaction;
  txType: YieldPlusTxType;
}) => {
  const {
    txHash: hash,
    txTimestamp: blockTimestamp,
    blockNumber,
    accountAddress,
    contractAddress,
    chainId,
    yieldPlusLongVTokenAddress,
    yieldPlusShortVTokenAddress,
    yieldPlusDsaVTokenAddress,
    yieldPlusPrincipalAmountMantissa,
    yieldPlusShortAmountMantissa,
    yieldPlusLongAmountMantissa,
    yieldPlusAmountRepaidMantissa,
    yieldPlusAmountRedeemedMantissa,
    yieldPlusAmountRedeemedDsaMantissa,
    yieldPlusDsaProfitAmountMantissa,
    yieldPlusCycleId,
  } = apiTransaction;

  const amounts: TxAmount[] = [];

  const dsaPoolAsset = yieldPlusDsaVTokenAddress
    ? vTokenAssetMapping[yieldPlusDsaVTokenAddress.toLowerCase() as Address]
    : undefined;

  const shortPoolAsset = yieldPlusShortVTokenAddress
    ? vTokenAssetMapping[yieldPlusShortVTokenAddress.toLowerCase() as Address]
    : undefined;

  const longPoolAsset = yieldPlusLongVTokenAddress
    ? vTokenAssetMapping[yieldPlusLongVTokenAddress.toLowerCase() as Address]
    : undefined;

  if (
    yieldPlusPrincipalAmountMantissa &&
    Number(yieldPlusPrincipalAmountMantissa) > 0 &&
    dsaPoolAsset
  ) {
    amounts.push(
      formatToAmount({
        asset: dsaPoolAsset,
        amountMantissa: yieldPlusPrincipalAmountMantissa,
      }),
    );
  }

  if (
    yieldPlusAmountRedeemedDsaMantissa &&
    Number(yieldPlusAmountRedeemedDsaMantissa) > 0 &&
    dsaPoolAsset
  ) {
    amounts.push(
      formatToAmount({
        asset: dsaPoolAsset,
        amountMantissa: BigInt(yieldPlusAmountRedeemedDsaMantissa) * -1n,
      }),
    );
  }

  if (
    yieldPlusDsaProfitAmountMantissa &&
    Number(yieldPlusDsaProfitAmountMantissa) > 0 &&
    dsaPoolAsset
  ) {
    amounts.push(
      formatToAmount({
        asset: dsaPoolAsset,
        amountMantissa: yieldPlusDsaProfitAmountMantissa,
      }),
    );
  }

  if (yieldPlusLongAmountMantissa && Number(yieldPlusLongAmountMantissa) > 0 && longPoolAsset) {
    amounts.push(
      formatToAmount({
        asset: longPoolAsset,
        amountMantissa: yieldPlusLongAmountMantissa,
      }),
    );
  }

  if (
    yieldPlusAmountRedeemedMantissa &&
    Number(yieldPlusAmountRedeemedMantissa) > 0 &&
    longPoolAsset
  ) {
    amounts.push(
      formatToAmount({
        asset: longPoolAsset,
        amountMantissa: BigInt(yieldPlusAmountRedeemedMantissa) * -1n,
      }),
    );
  }

  if (yieldPlusShortAmountMantissa && Number(yieldPlusShortAmountMantissa) > 0 && shortPoolAsset) {
    amounts.push(
      formatToAmount({
        asset: shortPoolAsset,
        amountMantissa: yieldPlusShortAmountMantissa,
      }),
    );
  }

  if (
    yieldPlusAmountRepaidMantissa &&
    Number(yieldPlusAmountRepaidMantissa) > 0 &&
    shortPoolAsset
  ) {
    amounts.push(
      formatToAmount({
        asset: shortPoolAsset,
        amountMantissa: BigInt(yieldPlusAmountRepaidMantissa) * -1n,
      }),
    );
  }

  const transaction: YieldPlusTx = {
    cycleId: yieldPlusCycleId || '1',
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
