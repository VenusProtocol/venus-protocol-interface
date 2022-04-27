/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo } from 'react';
import {
  formatCoinsToReadableValue,
  formatCentsToReadableValue,
  formatApy,
} from 'utilities/common';
import { Asset, TokenId } from 'types';
import { Token } from 'components/v2/Token';
import { Table, ITableProps } from 'components/v2/Table';
import { useUserMarketInfo } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import { useTranslation } from 'translation';
import { BorrowRepayModal } from '../../Modals';
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
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('markets.columns.asset'), orderable: false },
      { key: 'apy', label: t('markets.columns.apy'), orderable: true },
      { key: 'wallet', label: t('markets.columns.wallet'), orderable: true },
      { key: 'liquidity', label: t('markets.columns.liquidity'), orderable: true },
    ],
    [],
  );

  // Format assets to rows
  const rows: ITableProps['data'] = borrowAssets.map(asset => {
    const borrowApy = isXvsEnabled ? asset.xvsBorrowApy.plus(asset.borrowApy) : asset.borrowApy;

    return [
      {
        key: 'asset',
        render: () => <Token symbol={asset.symbol as TokenId} />,
        value: asset.id,
      },
      {
        key: 'apy',
        render: () => formatApy(borrowApy),
        value: borrowApy.toNumber(),
      },
      {
        key: 'wallet',
        render: () =>
          formatCoinsToReadableValue({
            value: asset.walletBalance,
            tokenId: asset.id as TokenId,
          }),
        value: asset.walletBalance.toString(),
      },
      {
        key: 'liquidity',
        // Convert liquidity (expressed in dollars) to cents, then format it to
        // readable value
        render: () =>
          formatCentsToReadableValue({
            value: asset.liquidity.multipliedBy(100),
          }),
        value: asset.liquidity.toNumber(),
      },
    ];
  });

  const rowOnClick = (_e: React.MouseEvent<HTMLElement>, row: ITableProps['data'][number]) => {
    const asset = borrowAssets.find((value: Asset) => value.id === row[0].value);
    if (asset) {
      setSelectedAsset(asset);
    }
  };

  return (
    <>
      <div className={className} css={styles.tableContainer}>
        <Table
          title={t('markets.borrowMarketTableTitle')}
          columns={columns}
          data={rows}
          initialOrder={{
            orderBy: 'apy',
            orderDirection: 'asc',
          }}
          rowOnClick={rowOnClick}
          rowKeyIndex={0}
        />
      </div>

      {selectedAsset && (
        <BorrowRepayModal asset={selectedAsset} onClose={() => setSelectedAsset(undefined)} />
      )}
    </>
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
