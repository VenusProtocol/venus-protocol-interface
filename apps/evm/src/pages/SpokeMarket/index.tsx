import { useParams } from 'react-router';
import type { Address } from 'viem';

import { MarketPageGrid, Page } from 'components';
import { InterestRateChart } from 'containers/InterestRateChart';
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
            // The operate widget lands here in VPD-2069
            form={<div />}
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
