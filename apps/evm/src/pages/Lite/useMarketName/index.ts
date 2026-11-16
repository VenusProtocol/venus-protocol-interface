import { useTranslation } from 'libs/translations';
import type { LiteBorrowMarket, LiteEarnMarket } from '../types';

export const useMarketName = () => {
  const { t } = useTranslation();

  return (market: LiteEarnMarket | LiteBorrowMarket) => {
    if (market.source.type === 'spoke') {
      return market.source.pool.name;
    }

    if (market.source.type === 'hub') {
      return t('lite.markets.liquidityHub');
    }

    if (market.source.type === 'vault') {
      return t('lite.markets.xvsVault');
    }

    return t('lite.markets.corePool');
  };
};
