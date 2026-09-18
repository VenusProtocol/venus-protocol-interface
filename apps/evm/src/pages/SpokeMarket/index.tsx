import { useParams } from 'react-router';
import type { Address } from 'viem';

import { MarketPageGrid, Page } from 'components';
import { InterestRateChart } from 'containers/InterestRateChart';
import { SpokeForm } from 'containers/SpokeForm';
import { SpokeMarketLoader } from 'containers/SpokeMarketLoader';

import { BorrowInfo } from './BorrowInfo';
import { LoanInfo } from './LoanInfo';
import { SupportedCollateral } from './SupportedCollateral';

const SpokeMarket: React.FC = () => {
  const { spokePoolComptrollerAddress, spokeVTokenAddress } = useParams<{
    spokePoolComptrollerAddress: Address;
    spokeVTokenAddress: Address;
  }>();

  return (
    <Page>
      <SpokeMarketLoader
        spokePoolComptrollerAddress={spokePoolComptrollerAddress}
        spokeVTokenAddress={spokeVTokenAddress}
      >
        {({ spokePool, asset }) => (
          <MarketPageGrid
            form={<SpokeForm spokePool={spokePool} asset={asset} navType="searchParam" />}
            content={
              <div className="space-y-6">
                <BorrowInfo asset={asset} />

                <SupportedCollateral
                  collaterals={spokePool.assets.filter(({ isBorrowable }) => !isBorrowable)}
                />

                <InterestRateChart asset={asset} isIsolatedPoolMarket />

                <LoanInfo asset={asset} />
              </div>
            }
          />
        )}
      </SpokeMarketLoader>
    </Page>
  );
};

export default SpokeMarket;
