import { TRADE_TX_TYPES } from 'constants/marketTxTypes';
import type { MarketTxType, TradeTxType } from 'types';
import type { ApiAccountHistoricalTransaction, VTokenAssetMapping } from '../types';
import { convertToTxType } from './convertToTxType';
import { formatToMarketTransaction } from './formatToMarketTransaction';
import { formatToTradeTransaction } from './formatToTradeTransaction';

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

  if (TRADE_TX_TYPES.some(t => t === txType)) {
    return formatToTradeTransaction({
      vTokenAssetMapping,
      apiTransaction,
      txType: txType as TradeTxType,
    });
  }

  return formatToMarketTransaction({
    vTokenAssetMapping,
    apiTransaction,
    txType: txType as MarketTxType,
  });
};
