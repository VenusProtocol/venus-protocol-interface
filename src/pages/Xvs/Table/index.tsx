/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { Table, TableColumn, TokenIconWithSymbol } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { AssetDistribution, Token } from 'types';
import {
  areTokensEqual,
  compareBigNumbers,
  convertWeiToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  getContractAddress,
} from 'utilities';

import { useGetBalanceOf, useGetMainAssets, useGetVenusVaiVaultDailyRate } from 'clients/api';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import { TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';

import { useStyles } from '../styles';

type TableAsset = {
  token: Token;
  xvsPerDay: BigNumber | undefined;
  xvsSupplyApy: AssetDistribution['supplyApyPercentage'] | undefined;
  xvsBorrowApy: AssetDistribution['borrowApyPercentage'] | undefined;
};

interface XvsTableProps {
  assets: TableAsset[];
  isFetchingAssets: boolean;
}

const XvsTableUi: React.FC<XvsTableProps> = ({ assets, isFetchingAssets }) => {
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
            {formatPercentageToReadableValue(xvsSupplyApy)}
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
            {formatPercentageToReadableValue(xvsBorrowApy)}
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
      isFetching={isFetchingAssets}
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
  const { accountAddress } = useAuth();
  const { data: getMainAssetsData, isLoading: isGetMainAssetsLoading } = useGetMainAssets({
    accountAddress,
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
    const allAssets: TableAsset[] = (getMainAssetsData?.assets || []).map(asset => ({
      token: asset.vToken.underlyingToken,
      // Note: assets from the main pool only yield XVS, hence why we only take
      // the first distribution token in consideration (which will always be XVS
      // here)
      xvsPerDay: asset.distributions[0].supplyDailyDistributedTokens.plus(
        asset.distributions[0].borrowDailyDistributedTokens,
      ),
      xvsSupplyApy: asset.distributions[0].supplyApyPercentage,
      xvsBorrowApy: asset.distributions[0].borrowApyPercentage,
    }));

    const xvsAsset = (getMainAssetsData?.assets || []).find(asset =>
      areTokensEqual(asset.vToken.underlyingToken, TOKENS.xvs),
    );

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
        .times(xvsAsset.tokenPriceCents.div(100))
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
    getMainAssetsData?.assets,
    venusVaiVaultDailyRateData?.dailyRateWei,
    vaultVaiStakedData?.balanceWei,
  ]);

  return <XvsTableUi assets={assetsWithVai} isFetchingAssets={isGetMainAssetsLoading} />;
};

export default XvsTable;
