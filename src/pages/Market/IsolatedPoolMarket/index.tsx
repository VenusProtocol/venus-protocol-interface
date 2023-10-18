/** @jsxImportSource @emotion/react */
import * as React from 'react';
import { useParams } from 'react-router-dom';

import Market from '..';
import MarketLoader from '../MarketLoader';

const IsolatedPoolMarket: React.FC = () => {
  const { vTokenAddress, poolComptrollerAddress } = useParams();

  return (
    <MarketLoader
      poolComptrollerAddress={poolComptrollerAddress}
      vTokenAddress={vTokenAddress}
      isIsolatedPoolMarket
    >
      {marketProps => <Market {...marketProps} />}
    </MarketLoader>
  );
};

export default IsolatedPoolMarket;
