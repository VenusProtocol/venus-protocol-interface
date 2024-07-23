/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import type BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetBalanceOf, useGetLegacyPool, useGetVenusVaiVaultDailyRate } from 'clients/api';
import { Table, type TableColumn, TokenIconWithSymbol } from 'components';
import { useGetVaiVaultContractAddress } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { RewardDistributorDistribution, Token } from 'types';
import {
  areTokensEqual,
  calculateYearlyPercentageRate,
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
        label: t('xvs.columns.asset'),
        header: t('xvs.columns.asset'),
        cell: ({ row }) => <TokenIconWithSymbol token={row.original.token} />,
      },
      {
        accessorFn: row => row.xvsPerDay?.toNumber(),
        header: t('xvs.columns.xvsPerDay'),
        cell: ({ row }) => (
          <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
            {formatTokensToReadableValue({
              value: row.original.xvsPerDay,
              token: xvs,
            })}
          </Typography>
        ),
      },
      {
        accessorFn: row => row.xvsSupplyApy?.toNumber(),
        header: t('xvs.columns.supplyXvsApy'),
        cell: ({ row }) => (
          <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
            {formatPercentageToReadableValue(row.original.xvsSupplyApy)}
          </Typography>
        ),
      },
      {
        accessorFn: row => row.xvsBorrowApy?.toNumber(),
        header: t('xvs.columns.borrowXvsApy'),
        cell: ({ row }) => (
          <Typography variant="small1" css={[styles.whiteText, styles.fontWeight400]}>
            {formatPercentageToReadableValue(row.original.xvsBorrowApy)}
          </Typography>
        ),
      },
    ],
    [t, xvs, styles.fontWeight400, styles.whiteText],
  );

  return (
    <Table
      data={assets}
      columns={columns}
      isFetching={isFetchingAssets}
      initialState={{
        sorting: [
          {
            id: 'xvsPerDay',
            desc: true,
          },
        ],
      }}
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

      const dailyPercentageRate = vaiVaultDailyXvsRateTokens
        .times(xvsAsset.tokenPriceCents.div(100))
        .div(vaiVaultStakedTokens);

      const vaiApy = calculateYearlyPercentageRate({ dailyPercentageRate });

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
