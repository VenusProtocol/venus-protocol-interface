/** @jsxImportSource @emotion/react */
import { useParams } from 'react-router-dom';

import MarketLoader from 'containers/MarketLoader';
import { Page } from '../Page';

const IsolatedPoolMarket: React.FC = () => {
  const { vTokenAddress, poolComptrollerAddress } = useParams();

  return (
    <MarketLoader poolComptrollerAddress={poolComptrollerAddress} vTokenAddress={vTokenAddress}>
      {marketProps => <Page {...marketProps} />}
    </MarketLoader>
  );
};

export default IsolatedPoolMarket;
