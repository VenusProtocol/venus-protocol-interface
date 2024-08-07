/** @jsxImportSource @emotion/react */
import { useParams } from 'react-router-dom';

import MarketLoader from 'containers/MarketLoader';
import { Market } from '../Market';

const IsolatedPoolMarket: React.FC = () => {
  const { vTokenAddress, poolComptrollerAddress } = useParams();

  return (
    <MarketLoader poolComptrollerAddress={poolComptrollerAddress} vTokenAddress={vTokenAddress}>
      {marketProps => <Market {...marketProps} />}
    </MarketLoader>
  );
};

export default IsolatedPoolMarket;
