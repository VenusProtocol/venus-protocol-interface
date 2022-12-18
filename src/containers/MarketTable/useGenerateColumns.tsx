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
// t('marketTable.columnKeys.riskRating')
// t('marketTable.columnKeys.collateral')
// t('marketTable.columnKeys.supplyBalance')
// t('marketTable.columnKeys.borrowBalance')
// t('marketTable.columnKeys.userBorrowBalance')
// t('marketTable.columnKeys.userSupplyBalance')
// t('marketTable.columnKeys.userWalletBalanceTokens')
// t('marketTable.columnKeys.userPercentOfLimit')
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

  // Calculate borrow limit of user if userPercentOfLimit column needs to be
  // rendered
  const userTotalBorrowLimitCents = useMemo(() => {
    if (!columnKeys.includes('userPercentOfLimit')) {
      return 0;
    }

    return (
      assets
        .reduce((acc, asset) => {
          if (!asset.isCollateralOfUser) {
            return acc;
          }

          // Add collateral value of supplied asset if it's been set as
          // collateral
          return acc.plus(
            calculateCollateralValue({
              amountWei: convertTokensToWei({
                value: asset.userSupplyBalanceTokens,
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
  }, [assets, columnKeys.includes('userPercentOfLimit')]);

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
              ? asset.xvsBorrowApy.plus(asset.borrowApyPercentage)
              : asset.borrowApyPercentage;

            return formatToReadablePercentage(borrowApy);
          }

          if (column === 'supplyApyLtv' || column === 'labeledSupplyApyLtv') {
            const supplyApy = includeXvs
              ? asset.xvsSupplyApy.plus(asset.supplyApyPercentage)
              : asset.supplyApyPercentage;
            const ltv = +asset.collateralFactor * 100;

            return (
              <LayeredValues
                topValue={formatToReadablePercentage(supplyApy)}
                bottomValue={formatToReadablePercentage(ltv)}
              />
            );
          }

          if (column === 'collateral') {
            return asset.collateralFactor || asset.isCollateralOfUser ? (
              <Toggle onChange={() => collateralOnChange(asset)} value={asset.isCollateralOfUser} />
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

          if (column === 'riskRating') {
            // TODO: get from asset (see VEN-546)
            return <RiskLevel variant="MINIMAL" />;
          }

          if (column === 'userWalletBalanceTokens') {
            return formatTokensToReadableValue({
              value: asset.userWalletBalanceTokens,
              token: asset.vToken.underlyingToken,
              shortenLargeValue: true,
            });
          }

          if (column === 'userSupplyBalance') {
            return formatTokensToReadableValue({
              value: asset.userSupplyBalanceTokens,
              token: asset.vToken.underlyingToken,
              shortenLargeValue: true,
            });
          }

          if (column === 'userBorrowBalance') {
            return formatTokensToReadableValue({
              value: asset.userBorrowBalanceTokens,
              token: asset.vToken.underlyingToken,
              shortenLargeValue: true,
            });
          }

          if (column === 'supplyBalance') {
            return formatCentsToReadableValue({
              value: asset.supplyBalanceCents,
              shortenLargeValue: true,
            });
          }

          if (column === 'borrowBalance') {
            return formatCentsToReadableValue({
              value: asset.borrowBalanceCents,
              shortenLargeValue: true,
            });
          }

          if (column === 'userPercentOfLimit') {
            const userPercentOfLimit = calculatePercentage({
              numerator: +asset.userBorrowBalanceTokens
                .multipliedBy(asset.tokenPriceDollars)
                .times(100),
              denominator: +userTotalBorrowLimitCents,
            });

            return (
              <div css={styles.userPercentOfLimit}>
                <ProgressBar
                  min={0}
                  max={100}
                  value={userPercentOfLimit}
                  step={1}
                  ariaLabel={t('marketTable.columnKeys.userPercentOfLimit')}
                  css={styles.percentOfLimitProgressBar}
                />

                <Typography variant="small2" css={styles.white}>
                  {formatToReadablePercentage(userPercentOfLimit)}
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
                    ? rowA.xvsBorrowApy.plus(rowA.borrowApyPercentage)
                    : rowA.borrowApyPercentage;

                  const roaBBorrowApy = includeXvs
                    ? rowB.xvsBorrowApy.plus(rowB.borrowApyPercentage)
                    : rowB.borrowApyPercentage;

                  return compareBigNumbers(roaABorrowApy, roaBBorrowApy, direction);
                }

                if (column === 'supplyApyLtv' || column === 'labeledSupplyApyLtv') {
                  const roaASupplyApy = includeXvs
                    ? rowA.xvsSupplyApy.plus(rowA.supplyApyPercentage)
                    : rowA.supplyApyPercentage;

                  const roaBSupplyApy = includeXvs
                    ? rowB.xvsSupplyApy.plus(rowB.supplyApyPercentage)
                    : rowB.supplyApyPercentage;

                  return compareBigNumbers(roaASupplyApy, roaBSupplyApy, direction);
                }

                if (column === 'collateral') {
                  return compareBooleans(
                    rowA.isCollateralOfUser,
                    rowB.isCollateralOfUser,
                    direction,
                  );
                }

                if (column === 'liquidity') {
                  return compareNumbers(rowA.liquidityCents, rowB.liquidityCents, direction);
                }

                if (column === 'pool') {
                  // TODO: get pools from rowA and rowB and compare them
                  // together (see VEN-546)
                }

                if (column === 'riskRating') {
                  // TODO: get pool risk ratings from rowA and rowB and compare
                  // them together (see VEN-546)
                }

                if (column === 'userWalletBalanceTokens') {
                  return compareBigNumbers(
                    rowA.userWalletBalanceTokens,
                    rowB.userWalletBalanceTokens,
                    direction,
                  );
                }

                if (column === 'userSupplyBalance') {
                  return compareBigNumbers(
                    rowA.userSupplyBalanceTokens,
                    rowB.userSupplyBalanceTokens,
                    direction,
                  );
                }

                if (column === 'userBorrowBalance' || column === 'userPercentOfLimit') {
                  return compareBigNumbers(
                    rowA.userBorrowBalanceTokens,
                    rowB.userBorrowBalanceTokens,
                    direction,
                  );
                }

                if (column === 'supplyBalance') {
                  return compareBigNumbers(
                    rowA.supplyBalanceTokens,
                    rowB.supplyBalanceTokens,
                    direction,
                  );
                }

                if (column === 'borrowBalance') {
                  return compareBigNumbers(
                    rowA.borrowBalanceTokens,
                    rowB.borrowBalanceTokens,
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
