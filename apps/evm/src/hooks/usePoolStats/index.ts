import BigNumber from 'bignumber.js';

import {
  useGetTokenBalances,
  useGetVTokenBalances,
  useGetVenusVaiVaultDailyRate,
} from 'clients/api';
import type { CellProps } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
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

export type PoolStat =
  | 'supply'
  | 'borrow'
  | 'liquidity'
  | 'assetCount'
  | 'treasury'
  | 'dailyXvsDistribution';

export interface UsePoolStatsInput {
  pools: Pool[];
  stats: PoolStat[];
}

export const usePoolStats = ({ pools, stats }: UsePoolStatsInput) => {
  const { t } = useTranslation();

  const shouldDisplaySupply = stats.includes('supply');
  const shouldDisplayBorrow = stats.includes('borrow');
  const shouldDisplayLiquidity = stats.includes('liquidity');
  const shouldDisplayTreasury = stats.includes('treasury');
  const shouldDisplayDailyXvsDistribution = stats.includes('dailyXvsDistribution');

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
      enabled: shouldDisplayTreasury && !!vTreasuryContractAddress && tokens.length > 0,
    },
  );
  const treasuryTokenBalances = getTreasuryTokenBalancesData?.tokenBalances;

  const { data: getTreasuryVTokenBalancesData } = useGetVTokenBalances(
    {
      accountAddress: vTreasuryContractAddress || NULL_ADDRESS,
      vTokens,
    },
    {
      enabled: shouldDisplayTreasury && !!vTreasuryContractAddress && vTokens.length > 0,
    },
  );
  const treasuryVTokenBalances = getTreasuryVTokenBalancesData?.vTokenBalances;

  const { data: vaiVaultDailyRateData } = useGetVenusVaiVaultDailyRate({
    enabled: shouldDisplayDailyXvsDistribution,
  });
  const vaiVaultDailyRateMantissa = vaiVaultDailyRateData?.dailyRateMantissa;

  let totalSupplyCents = shouldDisplaySupply ? new BigNumber(0) : undefined;
  let totalBorrowCents = shouldDisplayBorrow ? new BigNumber(0) : undefined;
  let availableLiquidityCents = shouldDisplayLiquidity ? new BigNumber(0) : undefined;

  assets.forEach(asset => {
    if (shouldDisplaySupply && totalSupplyCents) {
      totalSupplyCents = totalSupplyCents.plus(asset.supplyBalanceCents);
    }

    if (shouldDisplayBorrow && totalBorrowCents) {
      totalBorrowCents = totalBorrowCents.plus(asset.borrowBalanceCents);
    }

    if (shouldDisplayLiquidity && availableLiquidityCents) {
      availableLiquidityCents = availableLiquidityCents.plus(
        asset.supplyBalanceCents.minus(asset.borrowBalanceCents),
      );
    }
  });

  let dailyXvsDistributionTokens =
    shouldDisplayDailyXvsDistribution && xvs
      ? assets.reduce(
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
          new BigNumber(0),
        )
      : undefined;

  if (
    shouldDisplayDailyXvsDistribution &&
    dailyXvsDistributionTokens &&
    vaiVaultDailyRateMantissa &&
    vai
  ) {
    const vaiVaultDailyXvsRateTokens = convertMantissaToTokens({
      value: vaiVaultDailyRateMantissa,
      token: vai,
    });

    dailyXvsDistributionTokens = dailyXvsDistributionTokens.plus(vaiVaultDailyXvsRateTokens);
  }

  const tokenPriceMapping: {
    [tokenAddress: Address]: BigNumber;
  } = {};

  const vTokenExchangeRateMapping: {
    [vTokenAddress: Address]: BigNumber;
  } = {};

  if (shouldDisplayTreasury) {
    assets.forEach(asset => {
      tokenPriceMapping[asset.vToken.underlyingToken.address.toLowerCase() as Address] =
        asset.tokenPriceCents;
      vTokenExchangeRateMapping[asset.vToken.address.toLowerCase() as Address] =
        asset.exchangeRateVTokens;
    });
  }

  if (shouldDisplayTreasury && vai) {
    tokenPriceMapping[vai.address.toLowerCase() as Address] = new BigNumber(100);
  }

  const treasuryCents =
    shouldDisplayTreasury && treasuryTokenBalances && treasuryVTokenBalances
      ? getTreasuryBalanceCents({
          treasuryTokenBalances,
          treasuryVTokenBalances,
          tokenPriceMapping,
          vTokenExchangeRateMapping,
        })
      : undefined;

  const cells: CellProps[] = stats.map(stat => {
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

    if (stat === 'dailyXvsDistribution') {
      return {
        label: t('poolsStats.cell.dailyXvsDistributionLabel'),
        value: xvs
          ? formatTokensToReadableValue({
              value: dailyXvsDistributionTokens,
              token: xvs,
            })
          : PLACEHOLDER_KEY,
      };
    }

    return {
      label: t('poolsStats.cell.assetsLabel'),
      value: assets.length || PLACEHOLDER_KEY,
    };
  });

  return cells;
};
