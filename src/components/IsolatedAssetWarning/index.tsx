/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool } from 'types';
import { getToken } from 'utilities';

import { poolData } from '__mocks__/models/pools';

import { TextButton } from '../Button';
import { Notice } from '../Notice';
import AssetTable from './AssetTable';
import { useStyles } from './styles';
import { WarningType } from './types';

export interface IsolatedAssetWarningUiProps {
  assetId: Asset['id'];
  pool: Pool;
  type: WarningType;
  className?: string;
}

export const IsolatedAssetWarningUi: React.FC<IsolatedAssetWarningUiProps> = ({
  pool,
  assetId,
  type,
  className,
}) => {
  const [showAssets, setShowAssets] = useState(false);
  const styles = useStyles();
  const { t } = useTranslation();

  const token = getToken(assetId);
  const translationArgs = {
    poolName: pool.name,
    tokenSymbol: token.symbol,
  };

  const handleShowAssets = () => setShowAssets(true);
  const handleHideAssets = () => setShowAssets(false);

  return (
    <div css={styles.container} className={className}>
      <Notice
        css={styles.notice}
        variant="warning"
        description={
          <>
            <div css={styles.description}>
              {type === 'borrow'
                ? // TODO: add text for borrow description
                  t('isolatedAssetWarning.borrowDescription', translationArgs)
                : t('isolatedAssetWarning.supplyDescription', translationArgs)}
            </div>

            <TextButton css={styles.inlineButton} onClick={handleShowAssets} small>
              {t('isolatedAssetWarning.showMarketsButtonLabel', {
                poolName: pool.name,
              })}
            </TextButton>
          </>
        }
      />

      {showAssets && (
        <AssetTable assets={pool.assets} type={type} onHideAssetsButtonClick={handleHideAssets} />
      )}
    </div>
  );
};

export interface IsolatedAssetWarningProps {
  assetId: Asset['id'];
  poolId: Pool['id'];
  type: WarningType;
  className?: string;
}

export const IsolatedAssetWarning: React.FC<IsolatedAssetWarningProps> = ({
  assetId,
  type,
  className,
}) => {
  // TODO: fetch actual value (see VEN-546)

  const pool = poolData[0];

  return <IsolatedAssetWarningUi assetId={assetId} pool={pool} type={type} className={className} />;
};

export default IsolatedAssetWarning;
