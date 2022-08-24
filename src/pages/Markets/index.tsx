/** @jsxImportSource @emotion/react */
import React from 'react';

import Header from './Header';
import MarketTable from './MarketTable';

const MarketsUi: React.FC = () => (
  <div>
    <Header />
    <MarketTable />
  </div>
);

const Markets: React.FC = () => <MarketsUi />;

export default Markets;
