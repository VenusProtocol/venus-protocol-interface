/** @jsxImportSource @emotion/react */
import { useParams } from 'react-router-dom';

import { NULL_ADDRESS } from 'constants/address';
import type { Address } from 'viem';
import Pool from '..';

const IsolatedPool: React.FC = () => {
  const { poolComptrollerAddress = NULL_ADDRESS } = useParams<{
    poolComptrollerAddress: Address;
  }>();

  return <Pool poolComptrollerAddress={poolComptrollerAddress} />;
};

export default IsolatedPool;
