/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { RiskLevel, Table, TableProps, Token } from 'components';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities';

import { useHideLgDownCss, useShowLgDownCss } from 'hooks/responsive';

import { useStyles as useSharedStyles } from '../styles';

export interface BorrowMarketTableProps extends Pick<TableProps, 'rowOnClick'> {
  assets: Asset[];
  isXvsEnabled: boolean;
}

const BorrowMarketTable: React.FC<BorrowMarketTableProps> = ({
  assets,
  isXvsEnabled,
  rowOnClick,
}) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();

  const showLgDownCss = useShowLgDownCss();
  const hideLgDownCss = useHideLgDownCss();

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('markets.columns.asset'), orderable: true, align: 'left' },
      { key: 'apy', label: t('markets.columns.apy'), orderable: true, align: 'right' },
      { key: 'market', label: t('markets.columns.market'), orderable: true, align: 'right' },
      { key: 'riskLevel', label: t('markets.columns.riskLevel'), orderable: true, align: 'right' },
      { key: 'liquidity', label: t('markets.columns.liquidity'), orderable: true, align: 'right' },
    ],
    [],
  );

  // Format assets to rows
  const rows: TableProps['data'] = assets.map(asset => {
    const borrowApy = isXvsEnabled ? asset.xvsBorrowApy.plus(asset.borrowApy) : asset.borrowApy;

    return [
      {
        key: 'asset',
        render: () => <Token tokenId={asset.id} />,
        value: asset.id,
        align: 'left',
      },
      {
        key: 'apy',
        render: () => formatToReadablePercentage(borrowApy),
        value: borrowApy.toNumber(),
        align: 'right',
      },
      {
        key: 'market',
        // TODO: map out markets once wired up
        render: () => (
          <div>
            <Link to="/market/xvs" css={sharedStyles.marketLink}>
              <Typography variant="small2">Venus</Typography>
            </Link>
          </div>
        ),
        value: 'venus',
        align: 'right',
      },
      {
        key: 'riskLevel',
        // TODO: map out risk levels once wired up
        render: () => <RiskLevel variant="MINIMAL" />,
        value: 'minimal',
        align: 'right',
      },
      {
        key: 'liquidity',
        render: () =>
          formatCentsToReadableValue({
            value: asset.liquidity.multipliedBy(100),
            shortenLargeValue: true,
          }),
        value: asset.liquidity.toNumber(),
        align: 'right',
      },
    ];
  });

  return (
    <Table
      columns={columns}
      data={rows}
      initialOrder={{
        orderBy: 'apy',
        orderDirection: 'desc',
      }}
      rowKeyIndex={0}
      rowOnClick={rowOnClick}
      tableCss={hideLgDownCss}
      cardsCss={showLgDownCss}
      css={[sharedStyles.marketTable, sharedStyles.cardContentGrid]}
    />
  );
};

export default BorrowMarketTable;
