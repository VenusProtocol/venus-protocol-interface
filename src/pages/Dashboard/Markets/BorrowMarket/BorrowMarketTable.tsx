import React, { useMemo } from 'react';
import { Table, ITableProps, Token } from 'components';
import { useTranslation } from 'translation';
import { Asset, TokenId } from 'types';
import {
  formatCoinsToReadableValue,
  formatCentsToReadableValue,
  formatToReadablePercentage,
} from 'utilities/common';
import { useIsSmDown } from '../../../../hooks/responsive';
import { AssetCardMobile } from '../AssetCardMobile';

export interface IBorrowMarketTableProps extends Pick<ITableProps, 'rowOnClick'> {
  assets: Asset[];
  isXvsEnabled: boolean;
}

const BorrowMarketTable: React.FC<IBorrowMarketTableProps> = ({
  assets,
  isXvsEnabled,
  rowOnClick,
}) => {
  const { t } = useTranslation();
  const isSmDown = useIsSmDown();
  const columns = useMemo(
    () => [
      { key: 'asset', label: t('markets.columns.asset'), orderable: false },
      { key: 'apy', label: t('markets.columns.apy'), orderable: true },
      { key: 'wallet', label: t('markets.columns.wallet'), orderable: true },
      { key: 'liquidity', label: t('markets.columns.liquidity'), orderable: true },
    ],
    [],
  );
  const columnsMobile = useMemo(
    () => [
      { key: 'apy', label: t('markets.columns.apy'), orderable: false },
      { key: 'wallet', label: t('markets.columns.wallet'), orderable: false },
      { key: 'liquidity', label: t('markets.columns.liquidity'), orderable: false },
    ],
    [],
  );
  // Format assets to rows
  const rows: ITableProps['data'] = assets.map(asset => {
    const borrowApy = isXvsEnabled ? asset.xvsBorrowApy.plus(asset.borrowApy) : asset.borrowApy;

    return [
      {
        key: 'asset',
        render: () => <Token symbol={asset.symbol as TokenId} />,
        value: asset.id,
      },
      {
        key: 'apy',
        render: () => formatToReadablePercentage(borrowApy),
        value: borrowApy.toNumber(),
      },
      {
        key: 'wallet',
        render: () =>
          formatCoinsToReadableValue({
            value: asset.walletBalance,
            tokenId: asset.id as TokenId,
            shorthand: true,
          }),
        value: asset.walletBalance.toString(),
      },
      {
        key: 'liquidity',
        render: () =>
          formatCentsToReadableValue({
            value: asset.liquidity.multipliedBy(100),
          }),
        value: asset.liquidity.toNumber(),
      },
    ];
  });

  if (isSmDown) {
    return (
      <>
        <h4>{t('markets.borrowMarketTableTitle')}</h4>
        {rows.map(([asset, apy, wallet, liquidity]) => (
          <AssetCardMobile
            title={asset.render()}
            columns={columnsMobile}
            data={[[apy, wallet, liquidity]]}
            rowOnClick={rowOnClick}
          />
        ))}
      </>
    );
  }
  return (
    <Table
      title={t('markets.borrowMarketTableTitle')}
      columns={columns}
      data={rows}
      initialOrder={{
        orderBy: 'apy',
        orderDirection: 'asc',
      }}
      rowKeyIndex={0}
      rowOnClick={rowOnClick}
      gridTemplateColumns="120px 1fr 1fr 1fr"
    />
  );
};

export default BorrowMarketTable;
