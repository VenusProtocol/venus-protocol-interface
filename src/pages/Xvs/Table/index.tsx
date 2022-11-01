/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Table, TableProps, TokenIconWithSymbol } from 'components';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset, Token } from 'types';
import {
  convertWeiToTokens,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  getContractAddress,
} from 'utilities';

import { useGetBalanceOf, useGetUserMarketInfo, useGetVenusVaiVaultDailyRate } from 'clients/api';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';

import { useStyles } from '../styles';

type TableAsset = {
  token: Asset['token'];
  xvsPerDay: Asset['xvsPerDay'] | undefined;
  xvsSupplyApy: Asset['xvsSupplyApy'] | undefined;
  xvsBorrowApy: Asset['xvsBorrowApy'] | undefined;
};

interface XvsTableProps {
  assets: TableAsset[];
}

const XvsTableUi: React.FC<XvsTableProps> = ({ assets }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('xvs.columns.asset'), orderable: false, align: 'left' },
      { key: 'xvsPerDay', label: t('xvs.columns.xvsPerDay'), orderable: true, align: 'right' },
      {
        key: 'supplyXvsApy',
        label: t('xvs.columns.supplyXvsApy'),
        orderable: true,
        align: 'right',
      },
      {
        key: 'borrowXvsApy',
        label: t('xvs.columns.borrowXvsApy'),
        orderable: true,
        align: 'right',
      },
    ],
    [],
  );

  // Format assets to rows
  const rows: TableProps['data'] = assets.map(asset => [
    {
      key: 'asset',
      render: () => <TokenIconWithSymbol token={asset.token} />,
      value: asset.token.id,
      align: 'left',
    },
    {
      key: 'xvsPerDay',
      render: () => (
        <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
          {formatTokensToReadableValue({
            value: asset.xvsPerDay,
            token: TOKENS.xvs,
            minimizeDecimals: true,
          })}
        </Typography>
      ),
      value: asset.xvsPerDay?.toFixed() || 0,
      align: 'right',
    },
    {
      key: 'supplyXvsApy',
      render: () => (
        <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
          {formatToReadablePercentage(asset.xvsSupplyApy)}
        </Typography>
      ),
      value: asset.xvsSupplyApy?.toFixed() || 0,
      align: 'right',
    },
    {
      key: 'borrowXvsApy',
      render: () => (
        <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
          {formatToReadablePercentage(asset.xvsBorrowApy)}
        </Typography>
      ),
      value: asset.xvsBorrowApy?.toFixed() || 0,
      align: 'right',
    },
  ]);

  return (
    <Table
      columns={columns}
      data={rows}
      initialOrder={{
        orderBy: 'xvsPerDay',
        orderDirection: 'desc',
      }}
      rowKeyExtractor={row => `${row[0].value}`}
      breakpoint="sm"
      css={styles.cardContentGrid}
    />
  );
};

const XvsTable: React.FC = () => {
  const { account } = useContext(AuthContext);
  // TODO: handle loading state (see VEN-591)
  const {
    data: { assets },
  } = useGetUserMarketInfo({
    accountAddress: account?.address,
  });

  const { data: venusVaiVaultDailyRateData } = useGetVenusVaiVaultDailyRate();

  const { data: vaultVaiStakedData } = useGetBalanceOf(
    {
      token: TOKENS.vai,
      accountAddress: getContractAddress('vaiVault'),
    },
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    },
  );

  const assetsWithVai = useMemo(() => {
    const allAssets: TableAsset[] = [...assets];
    const xvsAsset = assets.find(asset => asset.token.id === 'xvs');

    if (venusVaiVaultDailyRateData && vaultVaiStakedData && xvsAsset) {
      const venusVaiVaultDailyRateTokens = convertWeiToTokens({
        valueWei: venusVaiVaultDailyRateData.dailyRateWei,
        token: TOKENS.xvs,
      });

      const vaultVaiStakedTokens = convertWeiToTokens({
        valueWei: vaultVaiStakedData.balanceWei,
        token: TOKENS.vai,
      });

      const vaiApy = venusVaiVaultDailyRateTokens
        .times(xvsAsset.tokenPrice)
        .times(DAYS_PER_YEAR)
        .times(100)
        .div(vaultVaiStakedTokens);

      allAssets.unshift({
        token: TOKENS.vai,
        xvsPerDay: venusVaiVaultDailyRateTokens,
        xvsSupplyApy: vaiApy,
        xvsBorrowApy: undefined,
      });
    }

    return allAssets;
  }, [
    JSON.stringify(assets),
    venusVaiVaultDailyRateData?.dailyRateWei.toFixed(),
    vaultVaiStakedData?.balanceWei.toFixed(),
  ]);

  return <XvsTableUi assets={assetsWithVai} />;
};

export default XvsTable;
