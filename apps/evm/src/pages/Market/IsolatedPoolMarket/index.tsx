import { useParams } from 'react-router-dom';

import MarketLoader from 'containers/MarketLoader';
import type { Address } from 'viem';
import { Page } from '../Page';

const IsolatedPoolMarket: React.FC = () => {
  const { vTokenAddress, poolComptrollerAddress } = useParams<{
    vTokenAddress: Address;
    poolComptrollerAddress: Address;
  }>();

  return (
    <MarketLoader poolComptrollerAddress={poolComptrollerAddress} vTokenAddress={vTokenAddress}>
      {marketProps => <Page {...marketProps} />}
    </MarketLoader>
  );
};

export default IsolatedPoolMarket;
