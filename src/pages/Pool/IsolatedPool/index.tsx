/** @jsxImportSource @emotion/react */
import React from 'react';
import { useParams } from 'react-router-dom';

import Pool from '..';

const IsolatedPool: React.FC = () => {
  const { poolComptrollerAddress = '' } = useParams();

  return <Pool poolComptrollerAddress={poolComptrollerAddress} />;
};

export default IsolatedPool;
