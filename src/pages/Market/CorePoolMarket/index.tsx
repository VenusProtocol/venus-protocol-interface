/** @jsxImportSource @emotion/react */
import { useGetMainPoolComptrollerContractAddress } from 'packages/contracts';
import * as React from 'react';
import { useParams } from 'react-router-dom';

import Market from '..';
import MarketLoader from '../MarketLoader';

const CorePoolMarket: React.FC = () => {
  const { vTokenAddress } = useParams();
  const mainPoolComptrollerContractAddress = useGetMainPoolComptrollerContractAddress();

  return (
    <MarketLoader
      poolComptrollerAddress={mainPoolComptrollerContractAddress}
      vTokenAddress={vTokenAddress}
    >
      {marketProps => <Market {...marketProps} />}
    </MarketLoader>
  );
};

export default CorePoolMarket;
