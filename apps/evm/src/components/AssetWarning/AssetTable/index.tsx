/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';

import { useTranslation } from 'packages/translations';
import { Asset } from 'types';
import {
  compareBigNumbers,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';

import { TextButton } from '../../Button';
import { Icon } from '../../Icon';
import { TokenIconWithSymbol } from '../../TokenIconWithSymbol';
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
    t('assetWarning.assetTable.assetColumnTitle'),
    type === 'borrow'
      ? t('assetWarning.assetTable.borrowApyColumnTitle')
      : t('assetWarning.assetTable.supplyApyColumnTitle'),
    t('assetWarning.assetTable.liquidityColumnTitle'),
  ];

  const sortedAssets = [...assets].sort((a, b) =>
    compareBigNumbers(a.liquidityCents, b.liquidityCents, 'desc'),
  );

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
            key={`isolated-asset-warning-asset-table-data-row-${asset.vToken.underlyingToken.address}`}
          >
            <div css={styles.cell}>
              <TokenIconWithSymbol token={asset.vToken.underlyingToken} className="text-sm" />
            </div>

            <div css={styles.cell}>
              <Typography variant="small2">
                {formatPercentageToReadableValue(
                  type === 'borrow' ? asset.borrowApyPercentage : asset.supplyApyPercentage,
                )}
              </Typography>
            </div>

            <div css={styles.cell}>
              <Typography variant="small2">
                {formatCentsToReadableValue({
                  value: asset.liquidityCents,
                })}
              </Typography>
            </div>
          </div>
        ))}
      </div>

      <div css={[styles.row, styles.footer]}>
        <TextButton css={parentStyles.inlineButton} onClick={onHideAssetsButtonClick}>
          <div css={styles.hideAssetButtonContent}>
            <span>{t('assetWarning.hideAssetsButtonLabel')}</span>

            <Icon name="arrowUp" css={styles.hideAssetButtonIcon} />
          </div>
        </TextButton>
      </div>
    </div>
  );
};

export default AssetTable;
