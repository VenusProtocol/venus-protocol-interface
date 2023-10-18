/** @jsxImportSource @emotion/react */
import * as React from 'react';

import Header from './Header';
import PoolTable from './PoolTable';

const IsolatedPoolsUi: React.FC = () => (
  <div>
    <Header />
    <PoolTable />
  </div>
);

const IsolatedPools: React.FC = () => <IsolatedPoolsUi />;

export default IsolatedPools;
