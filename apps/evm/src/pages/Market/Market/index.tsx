import { AssetWarning } from 'components';
import type { Asset, Pool } from 'types';

export interface MarketProps {
  asset: Asset;
  pool: Pool;
}

export const Market: React.FC<MarketProps> = ({ asset, pool }) => {
  return (
    <div className="py-6 md:py-8 xl:py-12">
      <AssetWarning token={asset.vToken.underlyingToken} pool={pool} type="supply" />
    </div>
  );
};
