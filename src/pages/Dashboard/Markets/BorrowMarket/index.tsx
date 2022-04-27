/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { Paper } from '@mui/material';
import { Delimiter } from 'components';
import { Asset } from 'types';
import BorrowMarketTable from './BorrowMarketTable';
import BorrowingTable from './BorrowingTable';
import { useStyles } from '../styles';

export interface IBorrowMarketUiProps {
  className?: string;
  borrowMarketAssets: Asset[];
  borrowingAssets: Asset[];
  isXvsEnabled: boolean;
  userTotalBorrowLimit: BigNumber;
}

export const BorrowMarketUi: React.FC<IBorrowMarketUiProps> = ({
  className,
  borrowingAssets,
  borrowMarketAssets,
  isXvsEnabled,
  userTotalBorrowLimit,
}) => {
  const styles = useStyles();
  return (
    <Paper className={className} css={styles.tableContainer}>
      {borrowingAssets.length > 0 && (
        <>
          <BorrowingTable
            assets={borrowingAssets}
            isXvsEnabled={isXvsEnabled}
            userTotalBorrowLimit={userTotalBorrowLimit}
          />
          <Delimiter css={styles.delimiter} />
        </>
      )}
      <BorrowMarketTable assets={borrowMarketAssets} isXvsEnabled={isXvsEnabled} />
    </Paper>
  );
};

const BorrowMarket: React.FC<Omit<IBorrowMarketUiProps, 'className'>> = ({
  isXvsEnabled,
  borrowMarketAssets,
  borrowingAssets,
  userTotalBorrowLimit,
}) => (
  <BorrowMarketUi
    borrowingAssets={borrowingAssets}
    borrowMarketAssets={borrowMarketAssets}
    isXvsEnabled={isXvsEnabled}
    userTotalBorrowLimit={userTotalBorrowLimit}
  />
);

export default BorrowMarket;
