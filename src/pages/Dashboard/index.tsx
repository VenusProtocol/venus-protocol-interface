/** @jsxImportSource @emotion/react */
import React from 'react';
import MyAccount from './MyAccount';
import { SupplyMarket, BorrowMarket } from './Markets';
import { useStyles } from './styles';

const DashboardUi: React.FC = () => {
  const styles = useStyles();
  return (
    <div>
      <MyAccount />
      <div css={styles.container}>
        <SupplyMarket />
        <BorrowMarket />
      </div>
    </div>
  );
};

export default DashboardUi;
