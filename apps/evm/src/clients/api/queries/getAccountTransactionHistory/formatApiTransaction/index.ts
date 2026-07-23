import { LIQUIDITY_HUB_TX_TYPES, TRADE_TX_TYPES } from 'constants/marketTxTypes';
import type { LiquidityHubTxType, MarketTxType, TradeTxType } from 'types';
import type { ApiAccountHistoricalTransaction, VTokenAssetMapping, VhTokenMapping } from '../types';
import { convertToTxType } from './convertToTxType';
import { formatToLiquidityHubTransaction } from './formatToLiquidityHubTransaction';
import { formatToMarketTransaction } from './formatToMarketTransaction';
import { formatToTradeTransaction } from './formatToTradeTransaction';

export const formatApiTransaction = ({
  vTokenAssetMapping,
  vhTokenMapping,
  apiTransaction,
}: {
  vTokenAssetMapping: VTokenAssetMapping;
  vhTokenMapping: VhTokenMapping;
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

  if (LIQUIDITY_HUB_TX_TYPES.some(t => t === txType)) {
    const liquidityHubTransaction = formatToLiquidityHubTransaction({
      vhTokenMapping,
      apiTransaction,
      txType: txType as LiquidityHubTxType,
    });

    if (liquidityHubTransaction) {
      return liquidityHubTransaction;
    }
  }

  return formatToMarketTransaction({
    vTokenAssetMapping,
    apiTransaction,
    txType: txType as MarketTxType,
  });
};
