/** @jsxImportSource @emotion/react */
import { SerializedStyles } from '@emotion/react';
import { Typography } from '@mui/material';
import { LayeredValues, RiskLevel, TableRowProps, Toggle, Token } from 'components';
import React from 'react';
import { Link } from 'react-router-dom';
import { Asset } from 'types';
import {
  formatCentsToReadableValue,
  formatToReadablePercentage,
  formatTokensToReadableValue,
} from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

import { ColumnName } from './types';

const generateRow = ({
  asset,
  columns,
  isXvsEnabled,
  collateralOnChange,
  marketLinkCss,
}: {
  asset: Asset;
  columns: ColumnName[];
  isXvsEnabled: boolean;
  collateralOnChange: (asset: Asset) => void;
  marketLinkCss: SerializedStyles;
}) =>
  columns.map((column, index) => {
    const row: TableRowProps = {
      key: column,
      align: index === 0 ? 'left' : 'right',
      render: () => null,
      value: '',
    };

    if (column === 'asset') {
      row.render = () => <Token tokenId={asset.id} />;
      row.value = asset.id;
    } else if (column === 'borrowApy' || column === 'labeledBorrowApy') {
      const borrowApy = isXvsEnabled ? asset.xvsBorrowApy.plus(asset.borrowApy) : asset.borrowApy;

      row.render = () => formatToReadablePercentage(borrowApy);
      row.value = borrowApy.toNumber();
    } else if (column === 'supplyApyLtv' || column === 'labeledSupplyApyLtv') {
      const supplyApy = isXvsEnabled ? asset.xvsSupplyApy.plus(asset.supplyApy) : asset.supplyApy;
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
    } else if (column === 'market') {
      row.render = () => (
        <div>
          <Link to="/market/xvs" css={marketLinkCss}>
            {/* TODO: get from asset */}
            <Typography variant="small2">Venus</Typography>
          </Link>
        </div>
      );
      row.value = 'venus'; // TODO: get from asset
    } else if (column === 'riskLevel') {
      // TODO: get from asset
      row.render = () => <RiskLevel variant="MINIMAL" />;
      // TODO: get from asset
      row.value = 'MINIMAL';
    } else if (column === 'walletBalance') {
      row.render = () =>
        formatTokensToReadableValue({
          value: asset.walletBalance,
          tokenId: asset.id,
          minimizeDecimals: true,
        });
      row.value = asset.walletBalance.toFixed();
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
    }

    return row;
  });

export default generateRow;
