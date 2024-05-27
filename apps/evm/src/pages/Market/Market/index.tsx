import { AssetWarning, Card } from 'components';
import { OperationForm } from 'containers/OperationForm';
import type { Asset, Pool } from 'types';
import { InterestRateChart } from './InterestRateChart';
import { MarketHistory } from './MarketHistory';
import MarketInfo from './MarketInfo';

export interface MarketProps {
  asset: Asset;
  pool: Pool;
}

export const Market: React.FC<MarketProps> = ({ asset, pool }) => {
  return (
    <div className="py-6 md:py-8 xl:py-12">
      <AssetWarning
        token={asset.vToken.underlyingToken}
        pool={pool}
        type="supply"
        className="mb-4 sm:mb-6"
      />

      <div className="space-y-6 lg:flex lg:space-y-0 lg:gap-x-6">
        <Card className="lg:order-2 lg:sticky lg:top-6 w-auto lg:w-[400px] self-start shrink-0 overflow-x-auto max-h-[calc(100vh-40px)]">
          <OperationForm poolComptrollerAddress={pool.comptrollerAddress} vToken={asset.vToken} />
        </Card>

        <div className="space-y-6 lg:grow lg:order-1">
          <MarketHistory asset={asset} poolComptrollerContractAddress={pool.comptrollerAddress} />

          <InterestRateChart asset={asset} isIsolatedPoolMarket={pool.isIsolated} />

          <MarketInfo asset={asset} />
        </div>
      </div>
    </div>
  );
};
