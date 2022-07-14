/** @jsxImportSource @emotion/react */
import React from 'react';

import Header from './Header';
import MarketTable from './MarketTable';

const MarketUi: React.FC = () => (
  <div>
    <Header />
    <MarketTable />
  </div>
);

const Market: React.FC = () => <MarketUi />;

export default Market;
