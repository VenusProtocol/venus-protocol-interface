import { YIELD_PLUS_TX_TYPES } from 'constants/marketTxTypes';
import type { MarketTxType, YieldPlusTxType } from 'types';
import type { ApiAccountHistoricalTransaction, VTokenAssetMapping } from '../types';
import { convertToTxType } from './convertToTxType';
import { formatToMarketTransaction } from './formatToMarketTransaction';
import { formatToYieldPlusTransaction } from './formatToYieldPlusTransaction';

export const formatApiTransaction = ({
  vTokenAssetMapping,
  apiTransaction,
}: {
  vTokenAssetMapping: VTokenAssetMapping;
  apiTransaction: ApiAccountHistoricalTransaction;
}) => {
  const { txType: apiTxType } = apiTransaction;
  const txType = convertToTxType(apiTxType);

  if (!txType) {
    return undefined;
  }

  if (YIELD_PLUS_TX_TYPES.some(t => t === txType)) {
    return formatToYieldPlusTransaction({
      vTokenAssetMapping,
      apiTransaction,
      txType: txType as YieldPlusTxType,
    });
  }

  return formatToMarketTransaction({
    vTokenAssetMapping,
    apiTransaction,
    txType: txType as MarketTxType,
  });
};
