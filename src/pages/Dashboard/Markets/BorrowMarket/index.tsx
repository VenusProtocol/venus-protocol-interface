/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { Paper } from '@mui/material';

import { Delimiter } from 'components';
import { Asset } from 'types';
import BorrowRepayModal from 'pages/Dashboard/Modals/BorrowRepay';
import BorrowMarketTable, { IBorrowMarketTableProps } from './BorrowMarketTable';
import BorrowingTable, { IBorrowingUiProps } from './BorrowingTable';
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
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | undefined>(undefined);
  const styles = useStyles();

  const rowOnClick: IBorrowMarketTableProps['rowOnClick'] | IBorrowingUiProps['rowOnClick'] = (
    _e,
    row,
  ) => {
    const asset = [...borrowingAssets, ...borrowMarketAssets].find(
      (value: Asset) => value.id === row[0].value,
    );

    if (asset) {
      setSelectedAsset(asset);
    }
  };

  return (
    <>
      <Paper className={className} css={styles.tableContainer}>
        {borrowingAssets.length > 0 && (
          <>
            <BorrowingTable
              assets={borrowingAssets}
              isXvsEnabled={isXvsEnabled}
              userTotalBorrowLimit={userTotalBorrowLimit}
              rowOnClick={rowOnClick}
            />
            <Delimiter css={styles.delimiter} />
          </>
        )}
        <BorrowMarketTable
          assets={borrowMarketAssets}
          isXvsEnabled={isXvsEnabled}
          hasBorrowingAssets={borrowingAssets.length > 0}
          rowOnClick={rowOnClick}
        />
      </Paper>

      {selectedAsset && (
        <BorrowRepayModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(undefined)}
          isXvsEnabled={isXvsEnabled}
        />
      )}
    </>
  );
};

const BorrowMarket: React.FC<IBorrowMarketUiProps> = ({
  className,
  isXvsEnabled,
  borrowMarketAssets,
  borrowingAssets,
  userTotalBorrowLimit,
}) => (
  <BorrowMarketUi
    className={className}
    borrowingAssets={borrowingAssets}
    borrowMarketAssets={borrowMarketAssets}
    isXvsEnabled={isXvsEnabled}
    userTotalBorrowLimit={userTotalBorrowLimit}
  />
);

export default BorrowMarket;
