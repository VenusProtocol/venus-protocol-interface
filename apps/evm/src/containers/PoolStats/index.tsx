import BigNumber from 'bignumber.js';
import { type GetTokenBalancesOutput, useGetTokenBalances } from 'clients/api';
import { type Cell, CellGroup, type CellGroupProps } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { getVTreasuryContractAddress, getVTreasuryV8ContractAddress } from 'libs/contracts';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { useMemo } from 'react';
import { ChainId, type Pool } from 'types';
import { convertMantissaToTokens, formatCentsToReadableValue, indexBy } from 'utilities';

type PoolStat = 'supply' | 'borrow' | 'liquidity' | 'assetCount' | 'treasury';

export interface PoolStatsProps extends Omit<CellGroupProps, 'cells'> {
  pools: Pool[];
  stats: PoolStat[];
}

export const PoolStats: React.FC<PoolStatsProps> = ({ pools, stats, ...otherProps }) => {
  const { t } = useTranslation();
  const { chainId } = useChainId();

  const assets = useMemo(() => pools.flatMap(pool => pool.assets), [pools]);
  const tokens = useMemo(() => assets.map(asset => asset.vToken.underlyingToken), [assets]);

  const treasuryContractAddress = useMemo(
    () =>
      chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET
        ? getVTreasuryContractAddress({ chainId })
        : getVTreasuryV8ContractAddress({ chainId }),
    [chainId],
  );

  const { data: getTreasuryTokenBalancesData } = useGetTokenBalances(
    {
      accountAddress: treasuryContractAddress || '',
      tokens,
    },
    {
      enabled: stats.includes('treasury') && !!treasuryContractAddress,
    },
  );

  const treasuryBalances = useMemo(
    () =>
      indexBy(
        (item: GetTokenBalancesOutput['tokenBalances'][number]) => item.token.address.toLowerCase(), // index by vToken address
        getTreasuryTokenBalancesData?.tokenBalances || [],
      ),
    [getTreasuryTokenBalancesData],
  );

  const cells: Cell[] = useMemo(() => {
    const { totalSupplyCents, totalBorrowCents, availableLiquidityCents, treasuryCents } =
      assets.reduce<{
        totalSupplyCents: BigNumber | undefined;
        totalBorrowCents: BigNumber | undefined;
        availableLiquidityCents: BigNumber | undefined;
        treasuryCents: BigNumber | undefined;
      }>(
        (acc, asset) => {
          let tempTreasuryCents: BigNumber | undefined;

          if (
            stats.includes('treasury') &&
            treasuryBalances?.[asset.vToken.underlyingToken.address.toLowerCase()]
          ) {
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

          return {
            totalSupplyCents: stats.includes('supply')
              ? (acc.totalSupplyCents ?? new BigNumber(0)).plus(asset.supplyBalanceCents)
              : undefined,
            totalBorrowCents: stats.includes('borrow')
              ? (acc.totalBorrowCents ?? new BigNumber(0)).plus(asset.borrowBalanceCents)
              : undefined,
            availableLiquidityCents: stats.includes('liquidity')
              ? (acc.availableLiquidityCents ?? new BigNumber(0)).plus(
                  asset.supplyBalanceCents.minus(asset.borrowBalanceCents),
                )
              : undefined,
            treasuryCents: tempTreasuryCents,
          };
        },
        {
          totalSupplyCents: undefined,
          totalBorrowCents: undefined,
          availableLiquidityCents: undefined,
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

      // Asset count
      return {
        label: t('poolsStats.cell.assetsLabel'),
        value: assets.length || PLACEHOLDER_KEY,
      };
    });
  }, [assets, treasuryBalances, stats, t]);

  return <CellGroup cells={cells} {...otherProps} />;
};
