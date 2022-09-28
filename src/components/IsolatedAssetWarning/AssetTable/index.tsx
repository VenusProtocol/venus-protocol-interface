/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities';

import { TextButton } from '../../Button';
import { Icon } from '../../Icon';
import { Token } from '../../Token';
import { useStyles as useParentStyles } from '../styles';
import { WarningType } from '../types';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

export interface AssetTableProps {
  type: WarningType;
  assets: Asset[];
  onHideAssetsButtonClick: () => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  type,
  assets,
  onHideAssetsButtonClick,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const parentStyles = useParentStyles();

  const headerColumnLabels = [
    t('isolatedAssetWarning.assetTable.assetColumnTitle'),
    type === 'borrow'
      ? t('isolatedAssetWarning.assetTable.borrowApyColumnTitle')
      : t('isolatedAssetWarning.assetTable.supplyApyColumnTitle'),
    t('isolatedAssetWarning.assetTable.liquidityColumnTitle'),
  ];

  const sortedAssets = [...assets].sort((a, b) => a.liquidity.minus(b.liquidity).toNumber());

  return (
    <div css={styles.container}>
      <div css={[styles.row, styles.headerRow]}>
        {headerColumnLabels.map(headerColumnLabel => (
          <div css={styles.cell} key={`isolated-asset-warning-header-column-${headerColumnLabel}`}>
            <Typography variant="small2">{headerColumnLabel}</Typography>
          </div>
        ))}
      </div>

      <div css={styles.dataRowList} data-testid={TEST_IDS.assetTable}>
        {sortedAssets.map(asset => (
          <div
            css={[styles.row, styles.dataRow]}
            key={`isolated-asset-warning-asset-table-data-row-${asset.id}`}
          >
            <div css={styles.cell}>
              <Token tokenId={asset.id} displaySymbol variant="small2" />
            </div>

            <div css={styles.cell}>
              <Typography variant="small2">
                {formatToReadablePercentage(type === 'borrow' ? asset.borrowApy : asset.supplyApy)}
              </Typography>
            </div>

            <div css={styles.cell}>
              <Typography variant="small2">
                {formatCentsToReadableValue({
                  value: asset.treasuryTotalBorrowsCents,
                  shortenLargeValue: true,
                })}
              </Typography>
            </div>
          </div>
        ))}
      </div>

      <div css={[styles.row, styles.footer]}>
        <TextButton css={parentStyles.inlineButton} onClick={onHideAssetsButtonClick} small>
          <div css={styles.hideAssetButtonContent}>
            <span>{t('isolatedAssetWarning.hideAssetsButtonLabel')}</span>

            <Icon name="arrowUp" css={styles.hideAssetButtonIcon} />
          </div>
        </TextButton>
      </div>
    </div>
  );
};

export default AssetTable;
