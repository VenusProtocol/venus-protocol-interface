/** @jsxImportSource @emotion/react */
import { useGetMainPoolComptrollerContractAddress } from 'packages/contracts';
import React from 'react';
import { Navigate } from 'react-router-dom';

import { routes } from 'constants/routing';

import Pool from '..';

const CorePool: React.FC = () => {
  const mainPoolComptrollerContractAddress = useGetMainPoolComptrollerContractAddress();

  if (!mainPoolComptrollerContractAddress) {
    return <Navigate to={routes.dashboard.path} />;
  }

  return <Pool poolComptrollerAddress={mainPoolComptrollerContractAddress} />;
};

export default CorePool;
