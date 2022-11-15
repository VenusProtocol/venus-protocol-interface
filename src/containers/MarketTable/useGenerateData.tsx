/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import {
  LayeredValues,
  ProgressBar,
  RiskLevel,
  TableProps,
  TableRowProps,
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
  convertTokensToWei,
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue,
} from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { IncludeXvsContext } from 'context/IncludeXvsContext';

import { useStyles } from './styles';
import { ColumnName } from './types';

const useGenerateData = ({
  assets,
  columns,
  collateralOnChange,
}: {
  assets: Asset[];
  columns: ColumnName[];
  collateralOnChange: (asset: Asset) => void;
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const { includeXvs } = useContext(IncludeXvsContext);

  // Calculate borrow limit of user if percentOfLimit column needs to be
  // rendered
  const userTotalBorrowLimitCents = useMemo(() => {
    if (!columns.includes('percentOfLimit')) {
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
              amountWei: convertTokensToWei({ value: asset.supplyBalance, token: asset.token }),
              token: asset.token,
              tokenPriceTokens: asset.tokenPrice,
              collateralFactor: asset.collateralFactor,
            }).times(100),
          );
        }, new BigNumber(0))
        // Convert BigNumber to number
        .toNumber()
    );
  }, [JSON.stringify(assets), columns.includes('percentOfLimit')]);

  const data: TableProps['data'] = assets.map(asset =>
    columns.map((column, index) => {
      const row: TableRowProps = {
        key: column,
        align: index === 0 ? 'left' : 'right',
        render: () => null,
        value: '',
      };

      if (column === 'asset') {
        row.render = () => <TokenIconWithSymbol token={asset.token} />;
        row.value = asset.token.id;
      } else if (column === 'borrowApy' || column === 'labeledBorrowApy') {
        const borrowApy = includeXvs ? asset.xvsBorrowApy.plus(asset.borrowApy) : asset.borrowApy;

        row.render = () => formatToReadablePercentage(borrowApy);
        row.value = borrowApy.toNumber();
      } else if (column === 'supplyApyLtv' || column === 'labeledSupplyApyLtv') {
        const supplyApy = includeXvs ? asset.xvsSupplyApy.plus(asset.supplyApy) : asset.supplyApy;
        const ltv = +asset.collateralFactor * 100;

        row.render = () => (
          <LayeredValues
            topValue={formatToReadablePercentage(supplyApy)}
            bottomValue={formatToReadablePercentage(ltv)}
          />
        );

        row.value = supplyApy.toNumber();
      } else if (column === 'collateral') {
        row.render = () =>
          asset.collateralFactor.toNumber() || asset.collateral ? (
            <Toggle onChange={() => collateralOnChange(asset)} value={asset.collateral} />
          ) : (
            PLACEHOLDER_KEY
          );

        row.value = asset.collateral;
      } else if (column === 'liquidity') {
        row.render = () =>
          formatCentsToReadableValue({
            value: asset.liquidity.multipliedBy(100),
            shortenLargeValue: true,
          });
        row.value = asset.liquidity.toNumber();
      } else if (column === 'pool') {
        row.render = () => (
          <div>
            {/* TODO: get link from asset (see VEN-546) */}
            <Link to="/market/xvs" css={styles.marketLink}>
              {/* TODO: get name from asset (see VEN-546) */}
              <Typography variant="small2">Venus</Typography>
            </Link>
          </div>
        );

        row.value = 'venus'; // TODO: get from asset
      } else if (column === 'riskLevel') {
        // TODO: get from asset (see VEN-546)
        row.render = () => <RiskLevel variant="MINIMAL" />;
        // TODO: get from asset (see VEN-546)
        row.value = 'MINIMAL';
      } else if (column === 'walletBalance') {
        row.render = () =>
          formatTokensToReadableValue({
            value: asset.walletBalance,
            token: asset.token,
            minimizeDecimals: true,
          });

        row.value = asset.walletBalance.toFixed();
      } else if (column === 'supplyBalance') {
        row.render = () =>
          formatTokensToReadableValue({
            value: asset.supplyBalance,
            token: asset.token,
            minimizeDecimals: true,
          });

        row.value = asset.supplyBalance.toFixed();
      } else if (column === 'borrowBalance') {
        row.render = () =>
          formatTokensToReadableValue({
            value: asset.borrowBalance,
            token: asset.token,
            minimizeDecimals: true,
          });

        row.value = asset.borrowBalance.toFixed();
      } else if (column === 'treasuryTotalBorrow') {
        row.render = () =>
          formatCentsToReadableValue({
            value: asset.treasuryTotalBorrowsCents,
            shortenLargeValue: true,
          });

        row.value = asset.treasuryTotalBorrowsCents.toFixed();
      } else if (column === 'treasuryTotalSupply') {
        row.render = () =>
          formatCentsToReadableValue({
            value: asset.treasuryTotalSupplyCents,
            shortenLargeValue: true,
          });

        row.value = asset.treasuryTotalSupplyCents.toFixed();
      } else if (column === 'percentOfLimit') {
        const percentOfLimit = calculatePercentage({
          numerator: +asset.borrowBalance.multipliedBy(asset.tokenPrice).times(100),
          denominator: +userTotalBorrowLimitCents,
        });

        row.render = () => (
          <div css={styles.percentOfLimit}>
            <ProgressBar
              min={0}
              max={100}
              value={percentOfLimit}
              step={1}
              ariaLabel={t('marketTable.columns.percentOfLimit')}
              css={styles.percentOfLimitProgressBar}
            />

            <Typography variant="small2" css={styles.white}>
              {formatToReadablePercentage(percentOfLimit)}
            </Typography>
          </div>
        );

        row.value = percentOfLimit;
      }

      return row;
    }),
  );

  return data;
};

export default useGenerateData;
