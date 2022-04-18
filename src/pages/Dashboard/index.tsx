/** @jsxImportSource @emotion/react */
import React from 'react';

import MyAccount from './MyAccount';
import SupplyMarket from './Markets/SupplyMarket';
import BorrowMarket from './Markets/BorrowMarket';

const DashboardUi: React.FC = () => (
  <div>
    <MyAccount />
    <SupplyMarket />
    <BorrowMarket />
  </div>
);

export default DashboardUi;
