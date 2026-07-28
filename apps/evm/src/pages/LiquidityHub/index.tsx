import { useParams } from 'react-router';
import type { Address } from 'viem';

import { MarketPageGrid, Page } from 'components';
import { LiquidityHubForm } from 'containers/LiquidityHubForm';
import LiquidityHubLoader from 'containers/LiquidityHubLoader';
import { AllocationDetails } from './AllocationDetails';
import { LiquidityHubHistory } from './LiquidityHubHistory';
import { LiquidityHubInfo } from './LiquidityHubInfo';

const LiquidityHub: React.FC = () => {
  const { vhTokenAddress } = useParams<{
    vhTokenAddress: Address;
  }>();

  return (
    <Page>
      <LiquidityHubLoader vhTokenAddress={vhTokenAddress}>
        {({ liquidityHub }) => (
          <MarketPageGrid
            form={<LiquidityHubForm navType="searchParam" vhToken={liquidityHub.vhToken} />}
            content={
              <div className="space-y-6">
                <LiquidityHubHistory liquidityHub={liquidityHub} />

                <AllocationDetails liquidityHub={liquidityHub} />

                <LiquidityHubInfo liquidityHub={liquidityHub} />
              </div>
            }
          />
        )}
      </LiquidityHubLoader>
    </Page>
  );
};

export default LiquidityHub;
