/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Table, TableColumn, TokenIconWithSymbol } from 'components';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import {
  compareBigNumbers,
  convertWeiToTokens,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  getContractAddress,
  sortBigNumbers,
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

  const columns: TableColumn<TableAsset>[] = useMemo(
    () => [
      {
        key: 'asset',
        label: t('xvs.columns.asset'),
        renderCell: ({ token }) => <TokenIconWithSymbol token={token} />,
      },
      {
        key: 'xvsPerDay',
        label: t('xvs.columns.xvsPerDay'),
        align: 'right',
        renderCell: ({ xvsPerDay }) => (
          <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
            {formatTokensToReadableValue({
              value: xvsPerDay,
              token: TOKENS.xvs,
              minimizeDecimals: true,
            })}
          </Typography>
        ),
        sortRows: (rowA, rowB, direction) =>
          compareBigNumbers(rowA.xvsPerDay, rowB.xvsPerDay, direction),
      },
      {
        key: 'supplyXvsApy',
        label: t('xvs.columns.supplyXvsApy'),
        align: 'right',
        renderCell: ({ xvsSupplyApy }) => (
          <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
            {formatToReadablePercentage(xvsSupplyApy)}
          </Typography>
        ),
        sortRows: (rowA, rowB, direction) =>
          compareBigNumbers(rowA.xvsSupplyApy, rowB.xvsSupplyApy, direction),
      },
      {
        key: 'borrowXvsApy',
        label: t('xvs.columns.borrowXvsApy'),
        align: 'right',
        renderCell: ({ xvsBorrowApy }) => (
          <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
            {formatToReadablePercentage(xvsBorrowApy)}
          </Typography>
        ),
        sortRows: (rowA, rowB, direction) =>
          compareBigNumbers(rowA.xvsBorrowApy, rowB.xvsBorrowApy, direction),
      },
    ],
    [],
  );

  return (
    <Table
      data={assets}
      columns={columns}
      initialOrder={{
        orderBy: columns[1],
        orderDirection: 'desc',
      }}
      rowKeyExtractor={row =>
        `xvs-table-row-${row.token.address}-${row.xvsBorrowApy}-${row.xvsPerDay}-${row.xvsSupplyApy}`
      }
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
