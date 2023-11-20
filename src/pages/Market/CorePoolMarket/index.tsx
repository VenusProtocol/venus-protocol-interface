/** @jsxImportSource @emotion/react */
import { useGetLegacyPoolComptrollerContractAddress } from 'packages/contracts';
import React from 'react';
import { useParams } from 'react-router-dom';

import Market from '..';
import MarketLoader from '../MarketLoader';

const CorePoolMarket: React.FC = () => {
  const { vTokenAddress } = useParams();
  const legacyPoolComptrollerContractAddress = useGetLegacyPoolComptrollerContractAddress();

  return (
    <MarketLoader
      poolComptrollerAddress={legacyPoolComptrollerContractAddress}
      vTokenAddress={vTokenAddress}
    >
      {marketProps => <Market {...marketProps} />}
    </MarketLoader>
  );
};

export default CorePoolMarket;
