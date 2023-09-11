/** @jsxImportSource @emotion/react */
import React from 'react';
import { Navigate } from 'react-router-dom';

import { routes } from 'constants/routing';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

import Pool from '..';

const CorePool: React.FC = () => {
  const mainPoolComptrollerContractAddress = useGetUniqueContractAddress({
    name: 'mainPoolComptroller',
  });

  if (!mainPoolComptrollerContractAddress) {
    return <Navigate to={routes.dashboard.path} />;
  }

  return <Pool poolComptrollerAddress={mainPoolComptrollerContractAddress} />;
};

export default CorePool;
