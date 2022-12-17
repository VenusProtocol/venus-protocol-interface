/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import {
  LayeredValues,
  ProgressBar,
  RiskLevel,
  TableColumn,
  Toggle,
  TokenIconWithSymbol,
} from 'components';
import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import {
  calculateCollateralValue,
  calculatePercentage,
  compareBigNumbers,
  compareBooleans,
  compareNumbers,
  convertTokensToWei,
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue,
} from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { IncludeXvsContext } from 'context/IncludeXvsContext';

import { useStyles } from './styles';
import { ColumnKey } from './types';

// Translation keys: do not remove this comment
// t('marketTable.columnKeys.asset')
// t('marketTable.columnKeys.supplyApyLtv')
// t('marketTable.columnKeys.labeledSupplyApyLtv')
// t('marketTable.columnKeys.borrowApy')
// t('marketTable.columnKeys.labeledBorrowApy')yar
// t('marketTable.columnKeys.pool')
// t('marketTable.columnKeys.supplyBalance')
// t('marketTable.columnKeys.borrowBalance')
// t('marketTable.columnKeys.riskLevel')
// t('marketTable.columnKeys.collateral')
// t('marketTable.columnKeys.treasuryTotalBorrow')
// t('marketTable.columnKeys.treasuryTotalSupply')
// t('marketTable.columnKeys.walletBalance')
// t('marketTable.columnKeys.percentOfLimit')
// t('marketTable.columnKeys.liquidity')

const useGenerateColumns = ({
  assets,
  columnKeys,
  collateralOnChange,
}: {
  assets: Asset[];
  columnKeys: ColumnKey[];
  collateralOnChange: (asset: Asset) => void;
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const { includeXvs } = useContext(IncludeXvsContext);

  // Calculate borrow limit of user if percentOfLimit column needs to be
  // rendered
  const userTotalBorrowLimitCents = useMemo(() => {
    if (!columnKeys.includes('percentOfLimit')) {
      return 0;
    }

    return (
      assets
        .reduce((acc, asset) => {
          if (!asset.collateral) {
            return acc;
          }

          // Add collateral value of supplied asset if it's been set as
          // collateral
          return acc.plus(
            calculateCollateralValue({
              amountWei: convertTokensToWei({
                value: asset.supplyBalance,
                token: asset.vToken.underlyingToken,
              }),
              token: asset.vToken.underlyingToken,
              tokenPriceDollars: asset.tokenPriceDollars,
              collateralFactor: asset.collateralFactor,
            }).times(100),
          );
        }, new BigNumber(0))
        // Convert BigNumber to number
        .toNumber()
    );
  }, [assets, columnKeys.includes('percentOfLimit')]);

  const columns: TableColumn<Asset>[] = useMemo(
    () =>
      columnKeys.map((column, index) => ({
        key: column,
        label: t(`marketTable.columnKeys.${column}`),
        align: index === 0 ? 'left' : 'right',
        renderCell: asset => {
          if (column === 'asset') {
            return <TokenIconWithSymbol token={asset.vToken.underlyingToken} />;
          }

          if (column === 'borrowApy' || column === 'labeledBorrowApy') {
            const borrowApy = includeXvs
              ? asset.xvsBorrowApy.plus(asset.borrowApy)
              : asset.borrowApy;

            return formatToReadablePercentage(borrowApy);
          }

          if (column === 'supplyApyLtv' || column === 'labeledSupplyApyLtv') {
            const supplyApy = includeXvs
              ? asset.xvsSupplyApy.plus(asset.supplyApy)
              : asset.supplyApy;
            const ltv = +asset.collateralFactor * 100;

            return (
              <LayeredValues
                topValue={formatToReadablePercentage(supplyApy)}
                bottomValue={formatToReadablePercentage(ltv)}
              />
            );
          }

          if (column === 'collateral') {
            return asset.collateralFactor || asset.collateral ? (
              <Toggle onChange={() => collateralOnChange(asset)} value={asset.collateral} />
            ) : (
              PLACEHOLDER_KEY
            );
          }

          if (column === 'liquidity') {
            return formatCentsToReadableValue({
              value: asset.liquidityCents,
              shortenLargeValue: true,
            });
          }

          if (column === 'pool') {
            return (
              <div>
                {/* TODO: get link from asset (see VEN-546) */}
                <Link to="/market/xvs" css={styles.marketLink}>
                  {/* TODO: get name from asset (see VEN-546) */}
                  <Typography variant="small2">Venus</Typography>
                </Link>
              </div>
            );
          }

          if (column === 'riskLevel') {
            // TODO: get from asset (see VEN-546)
            return <RiskLevel variant="MINIMAL" />;
          }

          if (column === 'walletBalance') {
            return formatTokensToReadableValue({
              value: asset.walletBalance,
              token: asset.vToken.underlyingToken,
              shortenLargeValue: true,
            });
          }
          if (column === 'supplyBalance') {
            return formatTokensToReadableValue({
              value: asset.supplyBalance,
              token: asset.vToken.underlyingToken,
              shortenLargeValue: true,
            });
          }

          if (column === 'borrowBalance') {
            return formatTokensToReadableValue({
              value: asset.borrowBalance,
              token: asset.vToken.underlyingToken,
              shortenLargeValue: true,
            });
          }

          if (column === 'treasuryTotalBorrow') {
            return formatCentsToReadableValue({
              value: asset.treasuryTotalBorrowsCents,
              shortenLargeValue: true,
            });
          }

          if (column === 'treasuryTotalSupply') {
            return formatCentsToReadableValue({
              value: asset.treasuryTotalSupplyCents,
              shortenLargeValue: true,
            });
          }

          if (column === 'percentOfLimit') {
            const percentOfLimit = calculatePercentage({
              numerator: +asset.borrowBalance.multipliedBy(asset.tokenPriceDollars).times(100),
              denominator: +userTotalBorrowLimitCents,
            });

            return (
              <div css={styles.percentOfLimit}>
                <ProgressBar
                  min={0}
                  max={100}
                  value={percentOfLimit}
                  step={1}
                  ariaLabel={t('marketTable.columnKeys.percentOfLimit')}
                  css={styles.percentOfLimitProgressBar}
                />

                <Typography variant="small2" css={styles.white}>
                  {formatToReadablePercentage(percentOfLimit)}
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
                  const roaABorrowApy = includeXvs
                    ? rowA.xvsBorrowApy.plus(rowA.borrowApy)
                    : rowA.borrowApy;

                  const roaBBorrowApy = includeXvs
                    ? rowB.xvsBorrowApy.plus(rowB.borrowApy)
                    : rowB.borrowApy;

                  return compareBigNumbers(roaABorrowApy, roaBBorrowApy, direction);
                }

                if (column === 'supplyApyLtv' || column === 'labeledSupplyApyLtv') {
                  const roaASupplyApy = includeXvs
                    ? rowA.xvsSupplyApy.plus(rowA.supplyApy)
                    : rowA.supplyApy;

                  const roaBSupplyApy = includeXvs
                    ? rowB.xvsSupplyApy.plus(rowB.supplyApy)
                    : rowB.supplyApy;

                  return compareBigNumbers(roaASupplyApy, roaBSupplyApy, direction);
                }

                if (column === 'collateral') {
                  return compareBooleans(rowA.collateral, rowB.collateral, direction);
                }

                if (column === 'liquidity') {
                  return compareNumbers(rowA.liquidityCents, rowB.liquidityCents, direction);
                }

                if (column === 'pool') {
                  // TODO: get pools from rowA and rowB and compare them
                  // together (see VEN-546)
                }

                if (column === 'riskLevel') {
                  // TODO: get pool risk levels from rowA and rowB and compare
                  // them together (see VEN-546)
                }

                if (column === 'walletBalance') {
                  return compareBigNumbers(rowA.walletBalance, rowB.walletBalance, direction);
                }

                if (column === 'supplyBalance') {
                  return compareBigNumbers(rowA.supplyBalance, rowB.supplyBalance, direction);
                }

                if (column === 'borrowBalance') {
                  return compareBigNumbers(rowA.borrowBalance, rowB.borrowBalance, direction);
                }

                if (column === 'treasuryTotalSupply') {
                  return compareBigNumbers(
                    rowA.treasuryTotalSupply,
                    rowB.treasuryTotalSupply,
                    direction,
                  );
                }

                if (column === 'percentOfLimit') {
                  const rowABorrowBalanceDollars = rowA.borrowBalance.multipliedBy(
                    rowA.tokenPriceDollars,
                  );
                  const rowBBorrowBalanceDollars = rowB.borrowBalance.multipliedBy(
                    rowB.tokenPriceDollars,
                  );

                  return compareBigNumbers(
                    rowABorrowBalanceDollars,
                    rowBBorrowBalanceDollars,
                    direction,
                  );
                }

                return 0;
              },
      })),
    [assets, columnKeys, userTotalBorrowLimitCents, includeXvs],
  );

  return columns;
};

export default useGenerateColumns;
