/** @jsxImportSource @emotion/react */
import React from 'react';

import Header from './Header';
import PoolTable from './PoolTable';

const PoolsUi: React.FC = () => (
  <div>
    <Header />
    <PoolTable />
  </div>
);

const Pools: React.FC = () => <PoolsUi />;

export default Pools;
