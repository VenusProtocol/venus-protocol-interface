/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { LayeredValues, RiskLevel, Table, TableProps, Toggle, Token } from 'components';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { formatToReadablePercentage } from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useHideLgDownCss, useShowLgDownCss } from 'hooks/responsive';

import { useStyles as useSharedStyles } from '../styles';

export interface SupplyMarketTableUiProps {
  assets: Asset[];
  isXvsEnabled: boolean;
  rowOnClick: (e: React.MouseEvent<HTMLElement>, row: TableProps['data'][number]) => void;
  collateralOnChange: (asset: Asset) => void;
}

export const SupplyMarketTable: React.FC<SupplyMarketTableUiProps> = ({
  assets,
  isXvsEnabled,
  collateralOnChange,
  rowOnClick,
}) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();

  const showLgDownCss = useShowLgDownCss();
  const hideLgDownCss = useHideLgDownCss();

  const columns = useMemo(
    () => [
      { key: 'asset', label: t('markets.columns.asset'), orderable: true, align: 'left' },
      { key: 'apyLtv', label: t('markets.columns.apyLtv'), orderable: true, align: 'right' },
      { key: 'market', label: t('markets.columns.market'), orderable: true, align: 'right' },
      { key: 'riskLevel', label: t('markets.columns.riskLevel'), orderable: true, align: 'right' },
      {
        key: 'collateral',
        label: t('markets.columns.collateral'),
        orderable: true,
        align: 'right',
      },
    ],
    [],
  );

  // Format assets to rows
  const rows: TableProps['data'] = useMemo(
    () =>
      assets.map(asset => {
        const supplyApy = isXvsEnabled ? asset.xvsSupplyApy.plus(asset.supplyApy) : asset.supplyApy;
        const ltv = +asset.collateralFactor * 100;

        return [
          {
            key: 'asset',
            render: () => <Token tokenId={asset.id} />,
            value: asset.id,
            align: 'left',
          },
          {
            key: 'apyLtv',
            render: () => (
              <LayeredValues
                topValue={formatToReadablePercentage(supplyApy)}
                bottomValue={formatToReadablePercentage(ltv)}
              />
            ),
            value: supplyApy.toNumber(),
            align: 'right',
          },
          {
            key: 'market',
            // TODO: map out markets once wired up
            render: () => (
              <div>
                <Link to="/market/xvs" css={sharedStyles.marketLink}>
                  <Typography variant="small2">Venus</Typography>
                </Link>
              </div>
            ),
            value: 'venus',
            align: 'right',
          },
          {
            key: 'riskLevel',
            // TODO: map out risk levels once wired up
            render: () => <RiskLevel variant="MINIMAL" />,
            value: 'minimal',
            align: 'right',
          },
          {
            key: 'collateral',
            render: () =>
              asset.collateralFactor.toNumber() || asset.collateral ? (
                <Toggle onChange={() => collateralOnChange(asset)} value={asset.collateral} />
              ) : (
                PLACEHOLDER_KEY
              ),
            value: asset.collateral,
            align: 'right',
          },
        ];
      }),
    [JSON.stringify(assets)],
  );

  return (
    <Table
      columns={columns}
      data={rows}
      initialOrder={{
        orderBy: 'apyLtv',
        orderDirection: 'desc',
      }}
      rowOnClick={rowOnClick}
      rowKeyExtractor={row => `${row[0].value}`}
      tableCss={hideLgDownCss}
      cardsCss={showLgDownCss}
      css={[sharedStyles.marketTable, sharedStyles.cardContentGrid]}
    />
  );
};

export default SupplyMarketTable;
