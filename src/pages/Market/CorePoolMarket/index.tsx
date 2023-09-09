/** @jsxImportSource @emotion/react */
import React from 'react';
import { useParams } from 'react-router-dom';

import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

import Market from '..';
import MarketLoader from '../MarketLoader';

const CorePoolMarket: React.FC = () => {
  const { vTokenAddress } = useParams();
  const mainPoolComptrollerContractAddress = useGetUniqueContractAddress({
    name: 'mainPoolComptroller',
  });

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
