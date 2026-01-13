import { Card, Page as PageComp } from 'components';
import { useParams } from 'react-router';
import type { Address } from 'viem';

import MarketLoader from 'containers/MarketLoader';
import AssetWarning from './AssetWarning';
import { EModeInfo } from './EModeInfo';
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
          <>
            <AssetWarning
              token={asset.vToken.underlyingToken}
              pool={pool}
              type="supply"
              className="mb-4 sm:mb-6"
            />

            <div className="space-y-6 lg:flex lg:space-y-0 lg:gap-x-6">
              <Card className="w-auto self-start shrink-0 overflow-x-auto lg:order-2 lg:sticky lg:w-[400px] lg:-top-4 lg:max-h-[calc(100vh-128px)]">
                <OperationForm
                  poolComptrollerAddress={pool.comptrollerAddress}
                  vToken={asset.vToken}
                />
              </Card>

              {/* w-0 is a hotfix to force the charts to adapt their size when resizing the window (see https://github.com/recharts/recharts/issues/172#issuecomment-307858843) */}
              <div className="space-y-6 lg:grow lg:order-1 lg:w-0">
                <MarketHistory
                  asset={asset}
                  poolComptrollerContractAddress={pool.comptrollerAddress}
                />

                <InterestRateChart asset={asset} isIsolatedPoolMarket={pool.isIsolated} />

                <EModeInfo eModeGroups={pool.eModeGroups} token={asset.vToken.underlyingToken} />

                <MarketInfo asset={asset} />
              </div>
            </div>
          </>
        )}
      </MarketLoader>
    </PageComp>
  );
};

export default Page;
