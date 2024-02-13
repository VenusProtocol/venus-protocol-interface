/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetBalanceOf, useGetLegacyPool, useGetVenusVaiVaultDailyRate } from 'clients/api';
import { Table, TableColumn, TokenIconWithSymbol } from 'components';
import { useGetVaiVaultContractAddress } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { RewardDistributorDistribution, Token } from 'types';
import {
  areTokensEqual,
  calculateApy,
  compareBigNumbers,
  convertMantissaToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

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
    [t, xvs],
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
  const { accountAddress } = useAccountAddress();
  const vai = useGetToken({
    symbol: 'VAI',
  });

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { data: getLegacyPoolData, isLoading: isGetLegacyPoolLoading } = useGetLegacyPool({
    accountAddress,
  });

  const { data: venusVaiVaultDailyRateData } = useGetVenusVaiVaultDailyRate();

  const vaiVaultContractAddress = useGetVaiVaultContractAddress();

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
    const allAssets: TableAsset[] = (getLegacyPoolData?.pool.assets || []).map(asset => {
      // Note: assets from the core pool only yield XVS, hence why we only take
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

    const xvsAsset = (getLegacyPoolData?.pool.assets || []).find(asset =>
      areTokensEqual(asset.vToken.underlyingToken, xvs!),
    );

    if (venusVaiVaultDailyRateData && vaultVaiStakedData && xvsAsset) {
      const vaiVaultDailyXvsRateTokens = convertMantissaToTokens({
        value: venusVaiVaultDailyRateData.dailyRateMantissa,
        token: xvs,
      });

      const vaiVaultStakedTokens = convertMantissaToTokens({
        value: vaultVaiStakedData.balanceMantissa,
        token: vai,
      });

      const dailyRate = vaiVaultDailyXvsRateTokens
        .times(xvsAsset.tokenPriceCents.div(100))
        .div(vaiVaultStakedTokens);

      const vaiApy = calculateApy({ dailyRate });

      allAssets.unshift({
        token: vai!,
        xvsPerDay: vaiVaultDailyXvsRateTokens,
        xvsSupplyApy: vaiApy,
        xvsBorrowApy: undefined,
      });
    }

    return allAssets;
  }, [getLegacyPoolData?.pool.assets, venusVaiVaultDailyRateData, vaultVaiStakedData, vai, xvs]);

  return <XvsTableUi assets={assetsWithVai} isFetchingAssets={isGetLegacyPoolLoading} xvs={xvs!} />;
};

export default XvsTable;
