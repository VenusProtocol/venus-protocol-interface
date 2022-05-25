/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useHistory } from 'react-router-dom';
import { Typography } from '@mui/material';
import {
  useUserMarketInfo,
  useGetVenusVaiVaultRate,
  useGetBalanceOf,
  useGetMarkets,
} from 'clients/api';
import { Token, Table, TableProps } from 'components';
import { AuthContext } from 'context/AuthContext';
import { useTranslation } from 'translation';
import { Asset, TokenId } from 'types';
import { getContractAddress, getToken } from 'utilities';
import { formatToReadablePercentage, formatCoinsToReadableValue } from 'utilities/common';
import { useStyles } from '../styles';

type TableAsset = Pick<Asset, 'id' | 'symbol'> & {
  xvsPerDay: Asset['xvsPerDay'] | undefined;
  xvsSupplyApy: Asset['xvsSupplyApy'] | undefined;
  xvsBorrowApy: Asset['xvsBorrowApy'] | undefined;
};

interface IXvsTableProps {
  assets: TableAsset[];
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

  const rowOnClick = (e: React.MouseEvent<HTMLElement>, row: TableProps['data'][number]) => {
    history.push(`/market/${row[0].value}`);
  };
  // Format assets to rows
  const rows: TableProps['data'] = assets.map(asset => [
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
      value: asset.xvsPerDay?.toFixed() || 0,
    },
    {
      key: 'supplyXvsApy',
      render: () => (
        <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
          {formatToReadablePercentage(asset.xvsSupplyApy)}
        </Typography>
      ),
      value: asset.xvsSupplyApy?.toFixed() || 0,
    },
    {
      key: 'borrowXvsApy',
      render: () => (
        <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
          {formatToReadablePercentage(asset.xvsBorrowApy)}
        </Typography>
      ),
      value: asset.xvsBorrowApy?.toFixed() || 0,
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
  const { data: { markets } = { markets: [] } } = useGetMarkets({
    placeholderData: { markets: [], dailyVenus: undefined },
  });
  const { data: venusVaiVaultRate } = useGetVenusVaiVaultRate();
  const { data: vaultVaiStaked } = useGetBalanceOf(
    { tokenId: 'vai', accountAddress: getContractAddress('vaiVault') },
    { enabled: !!account?.address },
  );
  const xvsMarket = markets.find(ele => ele.underlyingSymbol === 'XVS');
  let vaiApy;
  if (venusVaiVaultRate && vaultVaiStaked) {
    vaiApy = venusVaiVaultRate
      .times(xvsMarket ? xvsMarket.tokenPrice : 0)
      .times(365 * 100)
      .div(vaultVaiStaked?.div(new BigNumber(10).pow(getToken('vai').decimals)));
  }

  (assets as TableAsset[]).push({
    id: 'vai',
    symbol: 'VAI',
    xvsPerDay: venusVaiVaultRate,
    xvsSupplyApy: vaiApy,
    xvsBorrowApy: undefined,
  });
  return <XvsTableUi assets={assets} />;
};

export default XvsTable;
