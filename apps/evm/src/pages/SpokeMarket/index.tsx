import { useParams } from 'react-router';
import type { Address } from 'viem';

import { Page } from 'components';
import { SpokeMarketLoader } from 'containers/SpokeMarketLoader';

import { Content } from './Content';

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
        {({ spokePool, asset }) => <Content spokePool={spokePool} asset={asset} />}
      </SpokeMarketLoader>
    </Page>
  );
};

export default SpokeMarket;
