/** @jsxImportSource @emotion/react */
import React from 'react';

import { SupplyMarket, BorrowMarket } from './Markets';

const DashboardUi: React.FC = () => (
  <div>
    <SupplyMarket />
    <BorrowMarket />
  </div>
);

export default DashboardUi;
