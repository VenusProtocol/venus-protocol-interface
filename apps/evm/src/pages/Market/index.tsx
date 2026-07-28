import { useParams } from 'react-router';
import type { Address } from 'viem';

import { MarketPageGrid, Page as PageComp } from 'components';
import { routes } from 'constants/routing';
import { GatedAssetAcknowledgementModal } from 'containers/GatedAssetAcknowledgementModal';
import { MarketForm } from 'containers/MarketForm';
import MarketLoader from 'containers/MarketLoader';
import { useNavigate } from 'hooks/useNavigate';
import AssetWarning from './AssetWarning';
import { EModeInfo } from './EModeInfo';
import { InterestRateChart } from './InterestRateChart';
import { MarketHistory } from './MarketHistory';
import MarketInfo from './MarketInfo';

const Page: React.FC = () => {
  const { vTokenAddress, poolComptrollerAddress } = useParams<{
    vTokenAddress: Address;
    poolComptrollerAddress: Address;
  }>();

  const { navigate } = useNavigate();

  return (
    <PageComp>
      <MarketLoader poolComptrollerAddress={poolComptrollerAddress} vTokenAddress={vTokenAddress}>
        {({ asset, pool }) => (
          <>
            <AssetWarning
              token={asset.vToken.underlyingToken}
              pool={pool}
              asset={asset}
              className="mb-6"
            />

            <MarketPageGrid
              form={
                <MarketForm
                  poolComptrollerAddress={pool.comptrollerAddress}
                  vToken={asset.vToken}
                  navType="searchParam"
                />
              }
              content={
                <div className="space-y-6">
                  <MarketHistory asset={asset} />

                  <InterestRateChart asset={asset} isIsolatedPoolMarket={pool.isIsolated} />

                  <EModeInfo
                    eModeGroups={pool.eModeGroups}
                    token={asset.vToken.underlyingToken}
                    pool={pool}
                  />

                  <MarketInfo asset={asset} />
                </div>
              }
            />

            {asset.isGated && (
              <GatedAssetAcknowledgementModal onReject={() => navigate(routes.landing.path)} />
            )}
          </>
        )}
      </MarketLoader>
    </PageComp>
  );
};

export default Page;
