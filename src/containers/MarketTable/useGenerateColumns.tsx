/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { LayeredValues, ProgressBar, TableColumn, Toggle, TokenIconWithSymbol } from 'components';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'translation';
import {
  compareBigNumbers,
  compareBooleans,
  compareStrings,
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  getCombinedDistributionApys,
} from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { routes } from 'constants/routing';

import { useStyles } from './styles';
import { ColumnKey, PoolAsset } from './types';

// Translation keys: do not remove this comment
// t('marketTable.columnKeys.asset')
// t('marketTable.columnKeys.supplyApyLtv')
// t('marketTable.columnKeys.labeledSupplyApyLtv')
// t('marketTable.columnKeys.borrowApy')
// t('marketTable.columnKeys.labeledBorrowApy')yar
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

const PRICE_THRESHOLD = new BigNumber(0.0000000000000001);

const useGenerateColumns = ({
  poolAssets,
  columnKeys,
  collateralOnChange,
}: {
  poolAssets: PoolAsset[];
  columnKeys: ColumnKey[];
  collateralOnChange: (poolAsset: PoolAsset) => void;
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const columns: TableColumn<PoolAsset>[] = useMemo(
    () =>
      columnKeys.map((column, index) => ({
        key: column,
        label: t(`marketTable.columnKeys.${column}`),
        align: index === 0 ? 'left' : 'right',
        renderCell: poolAsset => {
          if (column === 'asset') {
            return <TokenIconWithSymbol token={poolAsset.vToken.underlyingToken} />;
          }

          if (column === 'borrowApy' || column === 'labeledBorrowApy') {
            const combinedDistributionApys = getCombinedDistributionApys({ asset: poolAsset });

            const borrowApy = poolAsset.borrowApyPercentage.minus(
              combinedDistributionApys.borrowApyPercentage,
            );

            return formatToReadablePercentage(borrowApy);
          }

          if (column === 'supplyApyLtv' || column === 'labeledSupplyApyLtv') {
            const combinedDistributionApys = getCombinedDistributionApys({ asset: poolAsset });

            const supplyApy = poolAsset.supplyApyPercentage.plus(
              combinedDistributionApys.supplyApyPercentage,
            );

            const ltv = +poolAsset.collateralFactor * 100;

            return (
              <LayeredValues
                topValue={formatToReadablePercentage(supplyApy)}
                bottomValue={formatToReadablePercentage(ltv)}
              />
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
            return formatCentsToReadableValue({
              value: price,
              isTokenPrice: true,
            });
          }

          if (column === 'pool') {
            return (
              <div>
                <Link
                  to={routes.pool.path.replace(
                    ':poolComptrollerAddress',
                    poolAsset.pool.comptrollerAddress,
                  )}
                  css={styles.marketLink}
                >
                  <Typography variant="small2">{poolAsset.pool.name}</Typography>
                </Link>
              </div>
            );
          }

          if (column === 'userWalletBalance') {
            return (
              <LayeredValues
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
            return poolAsset.userSupplyBalanceTokens.isGreaterThan(0) ? (
              <LayeredValues
                topValue={formatTokensToReadableValue({
                  value: poolAsset.userSupplyBalanceTokens,
                  token: poolAsset.vToken.underlyingToken,
                })}
                bottomValue={formatCentsToReadableValue({
                  value: poolAsset.userSupplyBalanceCents,
                })}
              />
            ) : (
              PLACEHOLDER_KEY
            );
          }

          if (column === 'userBorrowBalance') {
            return poolAsset.userBorrowBalanceTokens.isGreaterThan(0) ? (
              <LayeredValues
                topValue={formatTokensToReadableValue({
                  value: poolAsset.userBorrowBalanceTokens,
                  token: poolAsset.vToken.underlyingToken,
                })}
                bottomValue={formatCentsToReadableValue({
                  value: poolAsset.userBorrowBalanceCents,
                })}
              />
            ) : (
              PLACEHOLDER_KEY
            );
          }

          if (column === 'supplyBalance') {
            return (
              <LayeredValues
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
                <ProgressBar
                  min={0}
                  max={100}
                  value={poolAsset.userPercentOfLimit}
                  step={1}
                  ariaLabel={t('marketTable.columnKeys.userPercentOfLimit')}
                  css={styles.percentOfLimitProgressBar}
                />

                <Typography variant="small2" css={styles.white}>
                  {formatToReadablePercentage(poolAsset.userPercentOfLimit)}
                </Typography>
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
                    getCombinedDistributionApys({ asset: rowA }).borrowApyPercentage,
                  );
                  const roaBBorrowApy = rowB.borrowApyPercentage.minus(
                    getCombinedDistributionApys({ asset: rowB }).borrowApyPercentage,
                  );

                  return compareBigNumbers(roaABorrowApy, roaBBorrowApy, direction);
                }

                if (column === 'supplyApyLtv' || column === 'labeledSupplyApyLtv') {
                  const roaASupplyApy = rowA.supplyApyPercentage.plus(
                    getCombinedDistributionApys({ asset: rowA }).supplyApyPercentage,
                  );
                  const roaBSupplyApy = rowB.supplyApyPercentage.plus(
                    getCombinedDistributionApys({ asset: rowB }).supplyApyPercentage,
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
      })),
    [poolAssets, columnKeys],
  );

  return columns;
};

export default useGenerateColumns;
