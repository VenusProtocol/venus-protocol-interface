import type { Asset, Pool } from 'types';

export interface MarketInfoHeaderProps {
  asset: Asset | undefined;
  pool: Pool | undefined;
  isUserConnected: boolean;
  handleGoBack: () => void;
}
