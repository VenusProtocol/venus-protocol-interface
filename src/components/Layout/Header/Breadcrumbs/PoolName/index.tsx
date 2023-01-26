/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';

import { useGetPool } from 'clients/api';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useAuth } from 'context/AuthContext';

export interface PoolNameProps {
  poolComptrollerAddress: string;
}

const PoolName: React.FC<PoolNameProps> = ({ poolComptrollerAddress }) => {
  const { account } = useAuth();
  const { data: getPoolData } = useGetPool({
    accountAddress: account?.address,
    poolComptrollerAddress,
  });

  return <>{getPoolData?.pool?.name || PLACEHOLDER_KEY}</>;
};

export default PoolName;
