/** @jsxImportSource @emotion/react */
import React from 'react';

import SupplyMarket from './Markets/SupplyMarket';
import BorrowMarket from './Markets/BorrowMarket';

const DashboardUi: React.FC = () => (
  <div>
    <SupplyMarket />
    <BorrowMarket />
  </div>
);

export default DashboardUi;
