/** @jsxImportSource @emotion/react */
import { Paper } from '@mui/material';
import BigNumber from 'bignumber.js';
import { Delimiter } from 'components';
import React from 'react';
import { Asset, TokenId } from 'types';

import BorrowRepayModal from 'pages/Dashboard/Modals/BorrowRepay';

import { useStyles } from '../styles';
import BorrowMarketTable, { BorrowMarketTableProps } from './BorrowMarketTable';
import BorrowingTable, { BorrowingUiProps } from './BorrowingTable';

export interface BorrowMarketUiProps {
  className?: string;
  borrowMarketAssets: Asset[];
  borrowingAssets: Asset[];
  isXvsEnabled: boolean;
  userTotalBorrowLimitCents: BigNumber;
}

export const BorrowMarketUi: React.FC<BorrowMarketUiProps> = ({
  className,
  borrowingAssets,
  borrowMarketAssets,
  isXvsEnabled,
  userTotalBorrowLimitCents,
}) => {
  const [selectedAssetId, setSelectedAssetId] = React.useState<Asset['id'] | undefined>(undefined);
  const styles = useStyles();

  const rowOnClick: BorrowMarketTableProps['rowOnClick'] | BorrowingUiProps['rowOnClick'] = (
    _e,
    row,
  ) => {
    setSelectedAssetId(row[0].value as TokenId);
  };

  const selectedAsset = React.useMemo(
    () =>
      [...borrowingAssets, ...borrowMarketAssets].find(
        marketAsset => marketAsset.id === selectedAssetId,
      ),
    [selectedAssetId, JSON.stringify(borrowingAssets), JSON.stringify(borrowMarketAssets)],
  );

  return (
    <>
      <Paper className={className} css={styles.tableContainer}>
        {borrowingAssets.length > 0 && (
          <>
            <BorrowingTable
              assets={borrowingAssets}
              isXvsEnabled={isXvsEnabled}
              userTotalBorrowLimitCents={userTotalBorrowLimitCents}
              rowOnClick={rowOnClick}
            />
            <Delimiter css={styles.delimiter} />
          </>
        )}
        <BorrowMarketTable
          assets={borrowMarketAssets}
          isXvsEnabled={isXvsEnabled}
          rowOnClick={rowOnClick}
        />
      </Paper>

      {selectedAsset && (
        <BorrowRepayModal
          asset={selectedAsset}
          onClose={() => setSelectedAssetId(undefined)}
          isXvsEnabled={isXvsEnabled}
        />
      )}
    </>
  );
};

const BorrowMarket: React.FC<BorrowMarketUiProps> = ({
  className,
  isXvsEnabled,
  borrowMarketAssets,
  borrowingAssets,
  userTotalBorrowLimitCents,
}) => (
  <BorrowMarketUi
    className={className}
    borrowingAssets={borrowingAssets}
    borrowMarketAssets={borrowMarketAssets}
    isXvsEnabled={isXvsEnabled}
    userTotalBorrowLimitCents={userTotalBorrowLimitCents}
  />
);

export default BorrowMarket;
