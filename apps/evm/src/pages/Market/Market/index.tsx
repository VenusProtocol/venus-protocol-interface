import type { Asset } from 'types';

export interface MarketProps {
  asset: Asset;
  isIsolatedPoolMarket: boolean;
  poolComptrollerAddress: string;
}

export const Market: React.FC<MarketProps> = () => {
  return null;
};
