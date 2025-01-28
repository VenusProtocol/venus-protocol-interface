import BigNumber from 'bignumber.js';
import {
  type GetTokenBalancesOutput,
  useGetTokenBalances,
  useGetVenusVaiVaultDailyRate,
} from 'clients/api';
import { type Cell, CellGroup, type CellGroupProps } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useGetVTreasuryContractAddress } from 'hooks/useGetVTreasuryContractAddress';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import type { Pool } from 'types';
import {
  areTokensEqual,
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatTokensToReadableValue,
  indexBy,
} from 'utilities';

type PoolStat =
  | 'supply'
  | 'borrow'
  | 'liquidity'
  | 'assetCount'
  | 'treasury'
  | 'dailyXvsDistribution';

export interface PoolStatsProps extends Omit<CellGroupProps, 'cells'> {
  pools: Pool[];
  stats: PoolStat[];
}

export const PoolStats: React.FC<PoolStatsProps> = ({ pools, stats, ...otherProps }) => {
  const { t } = useTranslation();

  const assets = useMemo(() => pools.flatMap(pool => pool.assets), [pools]);
  const tokens = useMemo(() => assets.map(asset => asset.vToken.underlyingToken), [assets]);

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const vai = useGetToken({
    symbol: 'VAI',
  });

  const vTreasuryContractAddress = useGetVTreasuryContractAddress();

  const { data: getTreasuryTokenBalancesData } = useGetTokenBalances(
    {
      accountAddress: vTreasuryContractAddress || NULL_ADDRESS,
      tokens,
    },
    {
      enabled: stats.includes('treasury') && !!vTreasuryContractAddress,
    },
  );

  const { data: vaiVaultDailyRateData } = useGetVenusVaiVaultDailyRate();
  const vaiVaultDailyRateMantissa = vaiVaultDailyRateData?.dailyRateMantissa;

  const treasuryBalances = useMemo(
    () =>
      indexBy(
        (item: GetTokenBalancesOutput['tokenBalances'][number]) => item.token.address.toLowerCase(), // index by vToken address
        getTreasuryTokenBalancesData?.tokenBalances || [],
      ),
    [getTreasuryTokenBalancesData],
  );

  const cells: Cell[] = useMemo(() => {
    const {
      totalSupplyCents,
      totalBorrowCents,
      availableLiquidityCents,
      treasuryCents,
      dailyXvsDistributionTokens,
    } = assets.reduce<{
      totalSupplyCents: BigNumber | undefined;
      totalBorrowCents: BigNumber | undefined;
      availableLiquidityCents: BigNumber | undefined;
      dailyXvsDistributionTokens: BigNumber | undefined;
      treasuryCents: BigNumber | undefined;
    }>(
      (acc, asset) => {
        let tempTreasuryCents: BigNumber | undefined;

        if (
          stats.includes('treasury') &&
          treasuryBalances?.[asset.vToken.underlyingToken.address.toLowerCase()]
        ) {
          // Calculate treasury balance for this asset
          const assetTreasuryBalanceMantissa = new BigNumber(
            treasuryBalances[asset.vToken.underlyingToken.address.toLowerCase()].balanceMantissa,
          );

          const assetTreasuryBalanceTokens = convertMantissaToTokens({
            value: assetTreasuryBalanceMantissa,
            token: asset.vToken.underlyingToken,
          });

          const assetTreasuryBalanceCents = assetTreasuryBalanceTokens
            .multipliedBy(asset.tokenPriceCents)
            .toNumber();

          tempTreasuryCents = (acc.treasuryCents ?? new BigNumber(0)).plus(
            assetTreasuryBalanceCents,
          );
        }

        let tempDailyXvsDistributionTokens = new BigNumber(0);

        if (stats.includes('dailyXvsDistribution') && xvs) {
          // Aggregate asset XVS distributions
          tempDailyXvsDistributionTokens = assets.reduce(
            (total, asset) =>
              total.plus(
                asset.supplyDistributions
                  .concat(asset.borrowDistributions)
                  .reduce(
                    (assetTotal, distribution) =>
                      distribution.type === 'venus' && areTokensEqual(distribution.token, xvs)
                        ? assetTotal.plus(distribution.dailyDistributedTokens)
                        : assetTotal,
                    new BigNumber(0),
                  ),
              ),
            tempDailyXvsDistributionTokens,
          );
        }

        if (stats.includes('dailyXvsDistribution') && vaiVaultDailyRateMantissa && vai) {
          // Add XVS distribution of VAI (if VAI vault exists on the current chain)
          const vaiVaultDailyXvsRateTokens = convertMantissaToTokens({
            value: vaiVaultDailyRateMantissa,
            token: vai,
          });

          tempDailyXvsDistributionTokens = tempDailyXvsDistributionTokens.plus(
            vaiVaultDailyXvsRateTokens,
          );
        }

        return {
          totalSupplyCents: stats.includes('supply')
            ? (acc.totalSupplyCents ?? new BigNumber(0)).plus(asset.supplyBalanceCents)
            : acc.availableLiquidityCents,
          totalBorrowCents: stats.includes('borrow')
            ? (acc.totalBorrowCents ?? new BigNumber(0)).plus(asset.borrowBalanceCents)
            : acc.availableLiquidityCents,
          availableLiquidityCents: stats.includes('liquidity')
            ? (acc.availableLiquidityCents ?? new BigNumber(0)).plus(
                asset.supplyBalanceCents.minus(asset.borrowBalanceCents),
              )
            : acc.availableLiquidityCents,
          dailyXvsDistributionTokens: tempDailyXvsDistributionTokens,
          treasuryCents: tempTreasuryCents,
        };
      },
      {
        totalSupplyCents: undefined,
        totalBorrowCents: undefined,
        availableLiquidityCents: undefined,
        dailyXvsDistributionTokens: undefined,
        treasuryCents: undefined,
      },
    );

    return stats.map(stat => {
      if (stat === 'supply') {
        return {
          label: t('poolsStats.cell.totalSupplyLabel'),
          value: formatCentsToReadableValue({
            value: totalSupplyCents,
          }),
        };
      }

      if (stat === 'borrow') {
        return {
          label: t('poolsStats.cell.totalBorrowLabel'),
          value: formatCentsToReadableValue({
            value: totalBorrowCents,
          }),
        };
      }

      if (stat === 'liquidity') {
        return {
          label: t('poolsStats.cell.availableLiquidityLabel'),
          value: formatCentsToReadableValue({
            value: availableLiquidityCents,
          }),
        };
      }

      if (stat === 'treasury') {
        return {
          label: t('poolsStats.cell.treasuryLabel'),
          value: formatCentsToReadableValue({
            value: treasuryCents,
          }),
        };
      }

      if (stat === 'dailyXvsDistribution' && xvs) {
        return {
          label: t('poolsStats.cell.dailyXvsDistributionLabel'),
          value: formatTokensToReadableValue({
            value: dailyXvsDistributionTokens,
            token: xvs,
          }),
        };
      }

      // Asset count
      return {
        label: t('poolsStats.cell.assetsLabel'),
        value: assets.length || PLACEHOLDER_KEY,
      };
    });
  }, [assets, treasuryBalances, stats, t, xvs, vai, vaiVaultDailyRateMantissa]);

  return <CellGroup cells={cells} {...otherProps} />;
};
