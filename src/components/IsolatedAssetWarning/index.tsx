/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { Pool, Token } from 'types';

import { TextButton } from '../Button';
import { Notice } from '../Notice';
import AssetTable from './AssetTable';
import { useStyles } from './styles';
import { WarningType } from './types';

export interface IsolatedAssetWarningProps {
  type: WarningType;
  token: Token;
  pool?: Pool;
  className?: string;
}

export const IsolatedAssetWarning: React.FC<IsolatedAssetWarningProps> = ({
  pool,
  token,
  type,
  className,
}) => {
  const [showAssets, setShowAssets] = useState(false);
  const styles = useStyles();
  const { t } = useTranslation();

  const translationArgs = {
    poolName: pool?.name,
    tokenSymbol: token.symbol,
  };

  const handleShowAssets = () => setShowAssets(true);
  const handleHideAssets = () => setShowAssets(false);

  if (!pool) {
    return null;
  }

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

export default IsolatedAssetWarning;
