/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography } from '@mui/material';
import { useUserMarketInfo } from 'clients/api';
import { Token, Table, ITableProps } from 'components';
import { AuthContext } from 'context/AuthContext';
import { useTranslation } from 'translation';
import { Asset, TokenId } from 'types';
import { formatToReadablePercentage, formatCoinsToReadableValue } from 'utilities/common';
import { useStyles } from '../styles';

interface IXvsTableProps {
  assets: Asset[];
}

const XvsTableUi: React.FC<IXvsTableProps> = ({ assets }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const styles = useStyles();

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('xvs.columns.asset'), orderable: false },
      { key: 'xvsPerDay', label: t('xvs.columns.xvsPerDay'), orderable: true },
      { key: 'supplyXvsApy', label: t('xvs.columns.supplyXvsApy'), orderable: true },
      { key: 'borrowXvsApy', label: t('xvs.columns.borrowXvsApy'), orderable: true },
    ],
    [],
  );

  const rowOnClick = (e: React.MouseEvent<HTMLElement>, row: ITableProps['data'][number]) => {
    history.push(`/market/${row[0].value}`);
  };
  // Format assets to rows
  const rows: ITableProps['data'] = assets.map(asset => [
    {
      key: 'asset',
      render: () => <Token symbol={asset.symbol as TokenId} />,
      value: asset.id,
    },
    {
      key: 'xvsPerDay',
      render: () => (
        <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
          {formatCoinsToReadableValue({
            value: asset.xvsPerDay,
            tokenId: 'xvs',
            shorthand: true,
          })}
        </Typography>
      ),
      value: asset.xvsPerDay.toFixed(),
    },
    {
      key: 'supplyApy',
      render: () => (
        <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
          {formatToReadablePercentage(asset.xvsSupplyApy)}
        </Typography>
      ),
      value: asset.xvsSupplyApy.toFixed(),
    },
    {
      key: 'borrowApy',
      render: () => (
        <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
          {formatToReadablePercentage(asset.xvsBorrowApy)}
        </Typography>
      ),
      value: asset.xvsBorrowApy.toFixed(),
    },
  ]);

  return (
    <Table
      columns={columns}
      data={rows}
      initialOrder={{
        orderBy: 'asset',
        orderDirection: 'desc',
      }}
      rowKeyIndex={0}
      rowOnClick={rowOnClick}
      tableCss={styles.table}
      cardsCss={styles.cards}
      css={styles.cardContentGrid}
    />
  );
};

const XvsTable: React.FC = () => {
  const { account } = useContext(AuthContext);
  const { assets } = useUserMarketInfo({ accountAddress: account?.address });
  // @TODO include VAI in asset list when wiring up https://app.clickup.com/t/29xm81p
  return <XvsTableUi assets={assets} />;
};

export default XvsTable;
