/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { Table, TableColumn, TokenIconWithSymbol } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { RewardDistributorDistribution, Token } from 'types';
import {
  areTokensEqual,
  compareBigNumbers,
  convertWeiToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { useGetBalanceOf, useGetMainPool, useGetVenusVaiVaultDailyRate } from 'clients/api';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { useAuth } from 'context/AuthContext';
import useGetToken from 'hooks/useGetToken';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

import { useStyles } from '../styles';

type TableAsset = {
  token: Token;
  xvsPerDay: BigNumber | undefined;
  xvsSupplyApy: BigNumber | undefined;
  xvsBorrowApy: BigNumber | undefined;
};

interface XvsTableProps {
  assets: TableAsset[];
  isFetchingAssets: boolean;
  xvs: Token;
}

const XvsTableUi: React.FC<XvsTableProps> = ({ assets, isFetchingAssets, xvs }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const columns: TableColumn<TableAsset>[] = useMemo(
    () => [
      {
        key: 'asset',
        label: t('xvs.columns.asset'),
        selectOptionLabel: t('xvs.columns.asset'),
        renderCell: ({ token }) => <TokenIconWithSymbol token={token} />,
      },
      {
        key: 'xvsPerDay',
        label: t('xvs.columns.xvsPerDay'),
        selectOptionLabel: t('xvs.columns.xvsPerDay'),
        align: 'right',
        renderCell: ({ xvsPerDay }) => (
          <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
            {formatTokensToReadableValue({
              value: xvsPerDay,
              token: xvs,
            })}
          </Typography>
        ),
        sortRows: (rowA, rowB, direction) =>
          compareBigNumbers(rowA.xvsPerDay, rowB.xvsPerDay, direction),
      },
      {
        key: 'supplyXvsApy',
        label: t('xvs.columns.supplyXvsApy'),
        selectOptionLabel: t('xvs.columns.supplyXvsApy'),
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
        selectOptionLabel: t('xvs.columns.borrowXvsApy'),
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
  const vai = useGetToken({
    symbol: 'VAI',
  });

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { data: getMainPoolData, isLoading: isGetMainPoolLoading } = useGetMainPool({
    accountAddress,
  });

  const { data: venusVaiVaultDailyRateData } = useGetVenusVaiVaultDailyRate();

  const vaiVaultContractAddress = useGetUniqueContractAddress({
    name: 'vaiVault',
  });

  const { data: vaultVaiStakedData } = useGetBalanceOf(
    {
      token: vai!,
      accountAddress: vaiVaultContractAddress || '',
    },
    {
      enabled: !!vaiVaultContractAddress && !!vai,
    },
  );

  const assetsWithVai = useMemo(() => {
    const allAssets: TableAsset[] = (getMainPoolData?.pool.assets || []).map(asset => {
      // Note: assets from the main pool only yield XVS, hence why we only take
      // the first distribution token in consideration (which will always be XVS
      // here)
      const supplyXvsDistribution = asset.supplyDistributions[0] as RewardDistributorDistribution;
      const borrowXvsDistribution = asset.borrowDistributions[0] as RewardDistributorDistribution;

      return {
        token: asset.vToken.underlyingToken,
        xvsPerDay: supplyXvsDistribution.dailyDistributedTokens.plus(
          borrowXvsDistribution.dailyDistributedTokens,
        ),
        xvsSupplyApy: asset.supplyDistributions[0].apyPercentage,
        xvsBorrowApy: asset.borrowDistributions[0].apyPercentage,
      };
    });

    const xvsAsset = (getMainPoolData?.pool.assets || []).find(asset =>
      areTokensEqual(asset.vToken.underlyingToken, xvs!),
    );

    if (venusVaiVaultDailyRateData && vaultVaiStakedData && xvsAsset) {
      const venusVaiVaultDailyRateTokens = convertWeiToTokens({
        valueWei: venusVaiVaultDailyRateData.dailyRateWei,
        token: xvs,
      });

      const vaultVaiStakedTokens = convertWeiToTokens({
        valueWei: vaultVaiStakedData.balanceWei,
        token: vai,
      });

      const vaiApy = venusVaiVaultDailyRateTokens
        .times(xvsAsset.tokenPriceCents.div(100))
        .times(DAYS_PER_YEAR)
        .times(100)
        .div(vaultVaiStakedTokens);

      allAssets.unshift({
        token: vai!,
        xvsPerDay: venusVaiVaultDailyRateTokens,
        xvsSupplyApy: vaiApy,
        xvsBorrowApy: undefined,
      });
    }

    return allAssets;
  }, [
    getMainPoolData?.pool.assets,
    venusVaiVaultDailyRateData?.dailyRateWei,
    vaultVaiStakedData?.balanceWei,
    vai,
    xvs,
  ]);

  return <XvsTableUi assets={assetsWithVai} isFetchingAssets={isGetMainPoolLoading} xvs={xvs!} />;
};

export default XvsTable;
