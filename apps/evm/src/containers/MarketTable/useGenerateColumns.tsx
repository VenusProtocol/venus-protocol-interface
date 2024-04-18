/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

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
import {
  areAddressesEqual,
  cn,
  compareBigNumbers,
  compareBooleans,
  compareStrings,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  getCombinedDistributionApys,
  isAssetPaused,
} from 'utilities';

import { Apy } from './Apy';
import { useStyles } from './styles';
import type { ColumnKey, PoolAsset } from './types';

// Translation keys: do not remove this comment
// t('marketTable.columnKeys.asset')
// t('marketTable.columnKeys.supplyApyLtv')
// t('marketTable.columnKeys.labeledSupplyApyLtv')
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
// t('marketTable.columnSelectOptionLabel.supplyApyLtv')
// t('marketTable.columnSelectOptionLabel.labeledSupplyApyLtv')
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

const PRICE_THRESHOLD = new BigNumber(0.0000000000000001);

const useGenerateColumns = ({
  columnKeys,
  collateralOnChange,
}: {
  columnKeys: ColumnKey[];
  collateralOnChange: (poolAsset: PoolAsset) => void;
}) => {
  const { corePoolComptrollerContractAddress, stakedEthPoolComptrollerContractAddress } =
    useGetChainMetadata();
  const { t, Trans } = useTranslation();
  const styles = useStyles();

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
        } else if (column === 'supplyApyLtv' || column === 'labeledSupplyApyLtv') {
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
                  <TokenIconWithSymbol
                    token={poolAsset.vToken.underlyingToken}
                    className="flex-shrink-0"
                  />

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
              column === 'supplyApyLtv' ||
              column === 'borrowApy' ||
              column === 'labeledSupplyApyLtv' ||
              column === 'labeledBorrowApy'
            ) {
              return (
                <Apy className={cn(isPaused && 'text-grey')} asset={poolAsset} column={column} />
              );
            }

            if (column === 'collateral') {
              return poolAsset.collateralFactor || poolAsset.isCollateralOfUser ? (
                <Toggle
                  onChange={() => collateralOnChange(poolAsset)}
                  value={poolAsset.isCollateralOfUser}
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

            if (column === 'price') {
              const { tokenPriceCents } = poolAsset;
              const price = tokenPriceCents.isGreaterThan(PRICE_THRESHOLD)
                ? tokenPriceCents
                : new BigNumber(0);

              return (
                <span className={cn(isPaused && 'text-grey')}>
                  {formatCentsToReadableValue({
                    value: price,
                    isTokenPrice: true,
                  })}
                </span>
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

                if (
                  stakedEthPoolComptrollerContractAddress &&
                  areAddressesEqual(
                    stakedEthPoolComptrollerContractAddress,
                    poolAsset.pool.comptrollerAddress,
                  )
                ) {
                  return routes.stakedEthPool.path;
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
                      getCombinedDistributionApys({ asset: rowA }).totalBorrowApyPercentage,
                    );
                    const roaBBorrowApy = rowB.borrowApyPercentage.minus(
                      getCombinedDistributionApys({ asset: rowB }).totalBorrowApyPercentage,
                    );

                    return compareBigNumbers(roaABorrowApy, roaBBorrowApy, direction);
                  }

                  if (column === 'supplyApyLtv' || column === 'labeledSupplyApyLtv') {
                    const roaASupplyApy = rowA.supplyApyPercentage.plus(
                      getCombinedDistributionApys({ asset: rowA }).totalSupplyApyPercentage,
                    );
                    const roaBSupplyApy = rowB.supplyApyPercentage.plus(
                      getCombinedDistributionApys({ asset: rowB }).totalSupplyApyPercentage,
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

                  if (column === 'price') {
                    return compareBigNumbers(rowA.tokenPriceCents, rowB.tokenPriceCents, direction);
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
      stakedEthPoolComptrollerContractAddress,
      columnKeys,
      Trans,
      t,
      collateralOnChange,
      styles,
    ],
  );

  return columns;
};

export default useGenerateColumns;
