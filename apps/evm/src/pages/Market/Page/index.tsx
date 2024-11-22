import { Card, Page as PaceComp } from 'components';
import type { Asset, Pool } from 'types';

import AssetWarning from './AssetWarning';
import { InterestRateChart } from './InterestRateChart';
import { MarketHistory } from './MarketHistory';
import MarketInfo from './MarketInfo';
import { OperationForm } from './OperationForm';

export interface PageProps {
  asset: Asset;
  pool: Pool;
}

export const Page: React.FC<PageProps> = ({ asset, pool }) => (
  <PaceComp indexWithSearchEngines={false}>
    <div className="py-6 md:py-8 xl:py-12">
      <AssetWarning
        token={asset.vToken.underlyingToken}
        pool={pool}
        type="supply"
        className="mb-4 sm:mb-6"
      />

      <div className="space-y-6 lg:flex lg:space-y-0 lg:gap-x-6">
        <Card className="w-auto self-start shrink-0 overflow-x-auto lg:order-2 lg:sticky lg:w-[400px] lg:top-6 lg:max-h-[calc(100vh-48px)]">
          <OperationForm poolComptrollerAddress={pool.comptrollerAddress} vToken={asset.vToken} />
        </Card>

        {/* w-0 is a hotfix to force the charts to adapt their size when resizing the window (see https://github.com/recharts/recharts/issues/172#issuecomment-307858843) */}
        <div className="space-y-6 lg:grow lg:order-1 lg:w-0">
          <MarketHistory asset={asset} poolComptrollerContractAddress={pool.comptrollerAddress} />

          <InterestRateChart asset={asset} isIsolatedPoolMarket={pool.isIsolated} />

          <MarketInfo asset={asset} />
        </div>
      </div>
    </div>
  </PaceComp>
);
