/** @jsxImportSource @emotion/react */
import React from 'react';
import MyAccount from './MyAccount';
import { SupplyMarket, BorrowMarket } from './Markets';
import { useStyles } from './styles';

const DashboardUi: React.FC = () => {
  const styles = useStyles();
  const [isXvsEnabled, setIsXvsEnabled] = React.useState(true);
  return (
    <div>
      <MyAccount setIsXvsEnabled={setIsXvsEnabled} isXvsEnabled={isXvsEnabled} />
      <div css={styles.container}>
        <SupplyMarket isXvsEnabled={isXvsEnabled} />
        <BorrowMarket isXvsEnabled={isXvsEnabled} />
      </div>
    </div>
  );
};

export default DashboardUi;
