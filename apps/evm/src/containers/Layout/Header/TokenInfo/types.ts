import type { Asset, Pool } from 'types';

export interface TokenInfoHeaderProps {
  asset: Asset | undefined;
  pool: Pool | undefined;
  isUserConnected: boolean;
  handleGoBack: () => void;
}
