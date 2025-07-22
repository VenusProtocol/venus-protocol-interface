import { Card, Page as PageComp } from 'components';
import { useParams } from 'react-router';
import type { Address } from 'viem';

import MarketLoader from 'containers/MarketLoader';
import AssetWarning from './AssetWarning';
import { InterestRateChart } from './InterestRateChart';
import { MarketHistory } from './MarketHistory';
import MarketInfo from './MarketInfo';
import { OperationForm } from './OperationForm';

const Page: React.FC = () => {
  const { vTokenAddress, poolComptrollerAddress } = useParams<{
    vTokenAddress: Address;
    poolComptrollerAddress: Address;
  }>();

  return (
    <PageComp indexWithSearchEngines={false}>
      <MarketLoader poolComptrollerAddress={poolComptrollerAddress} vTokenAddress={vTokenAddress}>
        {({ asset, pool }) => (
          <div className="py-6 md:py-8 xl:py-12">
            <AssetWarning
              token={asset.vToken.underlyingToken}
              pool={pool}
              type="supply"
              className="mb-4 sm:mb-6"
            />

            <div className="space-y-6 xl:flex xl:space-y-0 xl:gap-x-6">
              <Card className="w-auto self-start shrink-0 overflow-x-auto xl:order-2 xl:sticky xl:w-[400px] xl:top-6 xl:max-h-[calc(100vh-48px)]">
                <OperationForm
                  poolComptrollerAddress={pool.comptrollerAddress}
                  vToken={asset.vToken}
                />
              </Card>

              {/* w-0 is a hotfix to force the charts to adapt their size when resizing the window (see https://github.com/recharts/recharts/issues/172#issuecomment-307858843) */}
              <div className="space-y-6 xl:grow xl:order-1 xl:w-0">
                <MarketHistory
                  asset={asset}
                  poolComptrollerContractAddress={pool.comptrollerAddress}
                />

                <InterestRateChart asset={asset} isIsolatedPoolMarket={pool.isIsolated} />

                <MarketInfo asset={asset} />
              </div>
            </div>
          </div>
        )}
      </MarketLoader>
    </PageComp>
  );
};

export default Page;
