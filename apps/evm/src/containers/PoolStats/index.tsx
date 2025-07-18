import BigNumber from 'bignumber.js';
import {
  type GetTokenBalancesOutput,
  type GetVTokenBalancesOutput,
  useGetTokenBalances,
  useGetVTokenBalances,
  useGetVenusVaiVaultDailyRate,
} from 'clients/api';
import { CellGroup, type CellGroupProps } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useGetVTreasuryContractAddress } from 'hooks/useGetVTreasuryContractAddress';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';
import {
  areTokensEqual,
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatTokensToReadableValue,
  indexBy,
} from 'utilities';
import { getAssetTreasuryBalanceCents } from './getAssetTreasuryBalanceCents';

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

  const assets = pools.flatMap(pool => pool.assets);
  const vTokens = assets.map(asset => asset.vToken);
  const tokens = vTokens.map(vToken => vToken.underlyingToken);

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
      enabled: stats.includes('treasury') && !!vTreasuryContractAddress && tokens.length > 0,
    },
  );

  const { data: getTreasuryVTokenBalancesData } = useGetVTokenBalances(
    {
      accountAddress: vTreasuryContractAddress || NULL_ADDRESS,
      vTokens,
    },
    {
      enabled: stats.includes('treasury') && !!vTreasuryContractAddress && vTokens.length > 0,
    },
  );

  const { data: vaiVaultDailyRateData } = useGetVenusVaiVaultDailyRate();
  const vaiVaultDailyRateMantissa = vaiVaultDailyRateData?.dailyRateMantissa;

  // Index treasury balances by token address
  const treasuryTokenBalances = indexBy(
    (item: GetTokenBalancesOutput['tokenBalances'][number]) => item.token.address.toLowerCase(),
    getTreasuryTokenBalancesData?.tokenBalances || [],
  );

  const treasuryVTokenBalances = indexBy(
    (item: GetVTokenBalancesOutput['vTokenBalances'][number]) => item.vToken.address.toLowerCase(),
    getTreasuryVTokenBalancesData?.vTokenBalances || [],
  );

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
      let tempDailyXvsDistributionTokens = new BigNumber(0);

      if (stats.includes('dailyXvsDistribution') && xvs) {
        // Aggregate asset XVS distributions
        tempDailyXvsDistributionTokens = assets.reduce(
          (total, asset) =>
            total.plus(
              asset.supplyTokenDistributions
                .concat(asset.borrowTokenDistributions)
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
        treasuryCents: stats.includes('treasury')
          ? (acc.treasuryCents ?? new BigNumber(0)).plus(
              getAssetTreasuryBalanceCents({
                asset,
                treasuryTokenBalances,
                treasuryVTokenBalances,
              }),
            )
          : undefined,
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

  const cells = stats.map(stat => {
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

  return <CellGroup cells={cells} {...otherProps} />;
};
