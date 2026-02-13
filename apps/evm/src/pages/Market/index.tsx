import { Page as PageComp } from 'components';
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
    <PageComp>
      <MarketLoader poolComptrollerAddress={poolComptrollerAddress} vTokenAddress={vTokenAddress}>
        {({ asset, pool }) => (
          <>
            <AssetWarning
              token={asset.vToken.underlyingToken}
              pool={pool}
              type="supply"
              className="mb-6"
            />

            <div className="space-y-6 lg:space-y-0 lg:gap-x-6 lg:grid lg:grid-cols-2 xl:grid-cols-[7fr_5fr]">
              <div className="w-auto self-start shrink-0 overflow-x-auto sm:p-6 sm:rounded-lg sm:border sm:border-blue sm:bg-dark-blue lg:order-2 lg:sticky lg:-top-4 lg:max-h-[calc(100vh-128px)]">
                <OperationForm
                  poolComptrollerAddress={pool.comptrollerAddress}
                  vToken={asset.vToken}
                  navType="searchParam"
                />
              </div>

              {/* w-0 is a hotfix to force the charts to adapt their size when resizing the window (see https://github.com/recharts/recharts/issues/172#issuecomment-307858843) */}
              <div className="space-y-6 lg:order-1">
                <MarketHistory
                  asset={asset}
                  poolComptrollerContractAddress={pool.comptrollerAddress}
                />

                <InterestRateChart asset={asset} isIsolatedPoolMarket={pool.isIsolated} />

                <EModeInfo
                  eModeGroups={pool.eModeGroups}
                  token={asset.vToken.underlyingToken}
                  pool={pool}
                />

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
