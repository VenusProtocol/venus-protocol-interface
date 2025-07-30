import BigNumber from 'bignumber.js';
import {
  useGetTokenBalances,
  useGetVTokenBalances,
  useGetVenusVaiVaultDailyRate,
} from 'clients/api';
import { CellGroup, type CellGroupProps } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useGetVTreasuryContractAddress } from 'hooks/useGetVTreasuryContractAddress';
import { useGetToken, useGetTokens } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';
import {
  areTokensEqual,
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import type { Address } from 'viem';
import { getTreasuryBalanceCents } from './getTreasuryBalanceCents';

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

  const tokens = useGetTokens();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const vai = useGetToken({
    symbol: 'VAI',
  });

  const assets = pools.flatMap(pool => pool.assets);
  const vTokens = assets.map(asset => asset.vToken);

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
  const treasuryTokenBalances = getTreasuryTokenBalancesData?.tokenBalances;

  const { data: getTreasuryVTokenBalancesData } = useGetVTokenBalances(
    {
      accountAddress: vTreasuryContractAddress || NULL_ADDRESS,
      vTokens,
    },
    {
      enabled: stats.includes('treasury') && !!vTreasuryContractAddress && vTokens.length > 0,
    },
  );
  const treasuryVTokenBalances = getTreasuryVTokenBalancesData?.vTokenBalances;

  const { data: vaiVaultDailyRateData } = useGetVenusVaiVaultDailyRate();
  const vaiVaultDailyRateMantissa = vaiVaultDailyRateData?.dailyRateMantissa;

  const {
    totalSupplyCents,
    totalBorrowCents,
    availableLiquidityCents,
    dailyXvsDistributionTokens,
  } = assets.reduce<{
    totalSupplyCents: BigNumber | undefined;
    totalBorrowCents: BigNumber | undefined;
    availableLiquidityCents: BigNumber | undefined;
    dailyXvsDistributionTokens: BigNumber | undefined;
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
      };
    },
    {
      totalSupplyCents: undefined,
      totalBorrowCents: undefined,
      availableLiquidityCents: undefined,
      dailyXvsDistributionTokens: undefined,
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

    const tokenPriceMapping: {
      [tokenAddress: Address]: BigNumber;
    } = {};

    const vTokenExchangeRateMapping: {
      [vTokenAddress: Address]: BigNumber;
    } = {};

    if (vai) {
      // Add price of VAI
      tokenPriceMapping[vai.address.toLowerCase() as Address] = new BigNumber(100);
    }

    if (stat === 'treasury') {
      assets.forEach(asset => {
        tokenPriceMapping[asset.vToken.underlyingToken.address.toLowerCase() as Address] =
          asset.tokenPriceCents;
        vTokenExchangeRateMapping[asset.vToken.address.toLowerCase() as Address] =
          asset.exchangeRateVTokens;
      });

      const treasuryCents =
        treasuryTokenBalances &&
        treasuryVTokenBalances &&
        getTreasuryBalanceCents({
          treasuryTokenBalances,
          treasuryVTokenBalances,
          tokenPriceMapping,
          vTokenExchangeRateMapping,
        });

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
