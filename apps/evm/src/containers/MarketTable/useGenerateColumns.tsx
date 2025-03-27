/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';

import { cn } from '@venusprotocol/ui';
import {
  InfoIcon,
  LayeredValues,
  ProgressBar,
  type TableColumn,
  Toggle,
  TokenIconWithSymbol,
} from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useTranslation } from 'libs/translations';
import { useAccountChainId, useChainId } from 'libs/wallet';
import {
  areAddressesEqual,
  compareBigNumbers,
  compareBooleans,
  compareStrings,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  getCombinedDistributionApys,
  isAssetPaused,
} from 'utilities';

import { Apy } from 'components';
import { useStyles } from './styles';
import type { ColumnKey, PoolAsset } from './types';

// Translation keys: do not remove this comment
// t('marketTable.columnKeys.asset')
// t('marketTable.columnKeys.supplyApy')
// t('marketTable.columnKeys.labeledSupplyApy')
// t('marketTable.columnKeys.borrowApy')
// t('marketTable.columnKeys.labeledBorrowApy')
// t('marketTable.columnKeys.pool')
// t('marketTable.columnKeys.collateral')
// t('marketTable.columnKeys.supplyBalance')
// t('marketTable.columnKeys.borrowBalance')
// t('marketTable.columnKeys.userBorrowBalance')
// t('marketTable.columnKeys.userSupplyBalance')
// t('marketTable.columnKeys.userWalletBalance')
// t('marketTable.columnKeys.userPercentOfLimit')
// t('marketTable.columnKeys.liquidity')
// t('marketTable.columnKeys.price')

// t('marketTable.columnSelectOptionLabel.asset')
// t('marketTable.columnSelectOptionLabel.supplyApy')
// t('marketTable.columnSelectOptionLabel.labeledSupplyApy')
// t('marketTable.columnSelectOptionLabel.borrowApy')
// t('marketTable.columnSelectOptionLabel.labeledBorrowApy')
// t('marketTable.columnSelectOptionLabel.pool')
// t('marketTable.columnSelectOptionLabel.collateral')
// t('marketTable.columnSelectOptionLabel.supplyBalance')
// t('marketTable.columnSelectOptionLabel.borrowBalance')
// t('marketTable.columnSelectOptionLabel.userBorrowBalance')
// t('marketTable.columnSelectOptionLabel.userSupplyBalance')
// t('marketTable.columnSelectOptionLabel.userWalletBalance')
// t('marketTable.columnSelectOptionLabel.userPercentOfLimit')
// t('marketTable.columnSelectOptionLabel.liquidity')
// t('marketTable.columnSelectOptionLabel.price')

const useGenerateColumns = ({
  columnKeys,
  collateralOnChange,
}: {
  columnKeys: ColumnKey[];
  collateralOnChange: (poolAsset: PoolAsset) => void;
}) => {
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();
  const { t, Trans } = useTranslation();
  const styles = useStyles();
  const { chainId: accountChainId } = useAccountChainId();
  const { chainId } = useChainId();
  const isAccountOnWrongChain = accountChainId !== chainId;

  const columns: TableColumn<PoolAsset>[] = useMemo(
    () =>
      columnKeys.map((column, index) => {
        let columnLabel: React.ReactNode | string = t(`marketTable.columnKeys.${column}`);

        if (column === 'borrowApy' || column === 'labeledBorrowApy') {
          columnLabel = (
            <Trans
              i18nKey={`marketTable.columnKeys.${column}`}
              components={{
                InfoIcon: (
                  <InfoIcon
                    tooltip={t('marketTable.columnTooltips.borrowApy')}
                    css={styles.getColumnLabelInfoIcon({
                      hasRightMargin: column === 'labeledBorrowApy',
                    })}
                  />
                ),
              }}
            />
          );
        } else if (column === 'supplyApy' || column === 'labeledSupplyApy') {
          columnLabel = (
            <Trans
              i18nKey={`marketTable.columnKeys.${column}`}
              components={{
                InfoIcon: (
                  <InfoIcon
                    tooltip={t('marketTable.columnTooltips.supplyApy')}
                    css={styles.getColumnLabelInfoIcon({
                      hasRightMargin: true,
                    })}
                  />
                ),
              }}
            />
          );
        }

        return {
          key: column,
          label: columnLabel,
          selectOptionLabel: t(`marketTable.columnSelectOptionLabel.${column}`),
          align: index === 0 ? 'left' : 'right',
          renderCell: poolAsset => {
            const isPaused = isAssetPaused({
              disabledTokenActions: poolAsset.disabledTokenActions,
            });

            if (column === 'asset') {
              return (
                <div className="flex items-center space-x-2">
                  <TokenIconWithSymbol token={poolAsset.vToken.underlyingToken} />

                  {isPaused && (
                    <InfoIcon
                      iconClassName="text-orange"
                      iconName="attention"
                      tooltip={t('marketTable.assetColumn.pausedAssetTooltip')}
                    />
                  )}
                </div>
              );
            }

            if (
              column === 'supplyApy' ||
              column === 'borrowApy' ||
              column === 'labeledSupplyApy' ||
              column === 'labeledBorrowApy'
            ) {
              return (
                <Apy
                  className={cn(isPaused && 'text-grey')}
                  asset={poolAsset}
                  type={
                    column === 'supplyApy' || column === 'labeledSupplyApy' ? 'supply' : 'borrow'
                  }
                />
              );
            }

            if (column === 'collateral') {
              return poolAsset.collateralFactor || poolAsset.isCollateralOfUser ? (
                <Toggle
                  onChange={() => collateralOnChange(poolAsset)}
                  value={poolAsset.isCollateralOfUser}
                  disabled={isAccountOnWrongChain}
                />
              ) : (
                PLACEHOLDER_KEY
              );
            }

            if (column === 'liquidity') {
              return (
                <LayeredValues
                  className={cn(isPaused && 'text-grey')}
                  topValue={formatTokensToReadableValue({
                    value: poolAsset.cashTokens,
                    token: poolAsset.vToken.underlyingToken,
                  })}
                  bottomValue={formatCentsToReadableValue({
                    value: poolAsset.liquidityCents,
                  })}
                />
              );
            }

            if (column === 'pool') {
              const getTo = () => {
                if (
                  areAddressesEqual(
                    corePoolComptrollerContractAddress,
                    poolAsset.pool.comptrollerAddress,
                  )
                ) {
                  return routes.corePool.path;
                }

                return routes.isolatedPool.path.replace(
                  ':poolComptrollerAddress',
                  poolAsset.pool.comptrollerAddress,
                );
              };

              const to = getTo();

              return (
                <div>
                  <Link
                    to={to}
                    className={cn(
                      'hover:text-blue text-sm underline',
                      isPaused ? 'text-grey' : 'text-offWhite',
                    )}
                  >
                    {poolAsset.pool.name}
                  </Link>
                </div>
              );
            }

            if (column === 'userWalletBalance') {
              return (
                <LayeredValues
                  className={cn(isPaused && 'text-grey')}
                  topValue={formatTokensToReadableValue({
                    value: poolAsset.userWalletBalanceTokens,
                    token: poolAsset.vToken.underlyingToken,
                  })}
                  bottomValue={formatCentsToReadableValue({
                    value: poolAsset.userWalletBalanceCents,
                  })}
                />
              );
            }

            if (column === 'userSupplyBalance') {
              return (
                <LayeredValues
                  className={cn(isPaused && 'text-grey')}
                  topValue={formatTokensToReadableValue({
                    value: poolAsset.userSupplyBalanceTokens,
                    token: poolAsset.vToken.underlyingToken,
                  })}
                  bottomValue={formatCentsToReadableValue({
                    value: poolAsset.userSupplyBalanceCents,
                  })}
                />
              );
            }

            if (column === 'userBorrowBalance') {
              return (
                <LayeredValues
                  className={cn(isPaused && 'text-grey')}
                  topValue={formatTokensToReadableValue({
                    value: poolAsset.userBorrowBalanceTokens,
                    token: poolAsset.vToken.underlyingToken,
                  })}
                  bottomValue={formatCentsToReadableValue({
                    value: poolAsset.userBorrowBalanceCents,
                  })}
                />
              );
            }

            if (column === 'supplyBalance') {
              return (
                <LayeredValues
                  className={cn(isPaused && 'text-grey')}
                  topValue={formatTokensToReadableValue({
                    value: poolAsset.supplyBalanceTokens,
                    token: poolAsset.vToken.underlyingToken,
                  })}
                  bottomValue={formatCentsToReadableValue({
                    value: poolAsset.supplyBalanceCents,
                  })}
                />
              );
            }

            if (column === 'borrowBalance') {
              return (
                <LayeredValues
                  className={cn(isPaused && 'text-grey')}
                  topValue={formatTokensToReadableValue({
                    value: poolAsset.borrowBalanceTokens,
                    token: poolAsset.vToken.underlyingToken,
                  })}
                  bottomValue={formatCentsToReadableValue({
                    value: poolAsset.borrowBalanceCents,
                  })}
                />
              );
            }

            if (column === 'userPercentOfLimit') {
              return (
                <div css={styles.userPercentOfLimit}>
                  <span className={cn(isPaused ? 'text-grey' : 'text-offWhite')}>
                    {formatPercentageToReadableValue(poolAsset.userPercentOfLimit)}
                  </span>

                  <ProgressBar
                    min={0}
                    max={100}
                    value={poolAsset.userPercentOfLimit}
                    step={1}
                    ariaLabel={t('marketTable.columnKeys.userPercentOfLimit')}
                    css={styles.percentOfLimitProgressBar}
                  />
                </div>
              );
            }
          },
          sortRows:
            column === 'asset'
              ? undefined
              : (rowA, rowB, direction) => {
                  if (column === 'borrowApy' || column === 'labeledBorrowApy') {
                    const roaABorrowApy = rowA.borrowApyPercentage.minus(
                      getCombinedDistributionApys({ asset: rowA }).totalBorrowApyBoostPercentage,
                    );
                    const roaBBorrowApy = rowB.borrowApyPercentage.minus(
                      getCombinedDistributionApys({ asset: rowB }).totalBorrowApyBoostPercentage,
                    );

                    return compareBigNumbers(roaABorrowApy, roaBBorrowApy, direction);
                  }

                  if (column === 'supplyApy' || column === 'labeledSupplyApy') {
                    const roaASupplyApy = rowA.supplyApyPercentage.plus(
                      getCombinedDistributionApys({ asset: rowA }).totalSupplyApyBoostPercentage,
                    );
                    const roaBSupplyApy = rowB.supplyApyPercentage.plus(
                      getCombinedDistributionApys({ asset: rowB }).totalSupplyApyBoostPercentage,
                    );

                    return compareBigNumbers(roaASupplyApy, roaBSupplyApy, direction);
                  }

                  // Put rows of tokens that can't be enabled as collateral at the
                  // bottom of the list
                  if (column === 'collateral' && rowA.collateralFactor === 0) return 1;
                  if (column === 'collateral' && rowB.collateralFactor === 0) return -1;
                  // Sort other rows normally
                  if (column === 'collateral') {
                    return compareBooleans(
                      rowA.isCollateralOfUser,
                      rowB.isCollateralOfUser,
                      direction,
                    );
                  }

                  if (column === 'liquidity') {
                    return compareBigNumbers(rowA.liquidityCents, rowB.liquidityCents, direction);
                  }

                  if (column === 'pool') {
                    return compareStrings(rowA.pool.name, rowB.pool.name, direction);
                  }

                  if (column === 'userWalletBalance') {
                    return compareBigNumbers(
                      rowA.userWalletBalanceCents,
                      rowB.userWalletBalanceCents,
                      direction,
                    );
                  }

                  if (column === 'userSupplyBalance') {
                    return compareBigNumbers(
                      rowA.userSupplyBalanceCents,
                      rowB.userSupplyBalanceCents,
                      direction,
                    );
                  }

                  if (column === 'userBorrowBalance' || column === 'userPercentOfLimit') {
                    return compareBigNumbers(
                      rowA.userBorrowBalanceCents,
                      rowB.userBorrowBalanceCents,
                      direction,
                    );
                  }

                  if (column === 'supplyBalance') {
                    return compareBigNumbers(
                      rowA.supplyBalanceCents,
                      rowB.supplyBalanceCents,
                      direction,
                    );
                  }

                  if (column === 'borrowBalance') {
                    return compareBigNumbers(
                      rowA.borrowBalanceCents,
                      rowB.borrowBalanceCents,
                      direction,
                    );
                  }

                  return 0;
                },
        };
      }),
    [
      corePoolComptrollerContractAddress,
      columnKeys,
      Trans,
      t,
      collateralOnChange,
      styles,
      isAccountOnWrongChain,
    ],
  );

  return columns;
};

export default useGenerateColumns;
