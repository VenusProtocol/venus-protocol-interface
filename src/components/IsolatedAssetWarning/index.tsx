/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { Pool, Token } from 'types';

import { TextButton } from '../Button';
import { Notice } from '../Notice';
import AssetTable from './AssetTable';
import { useStyles } from './styles';
import { WarningType } from './types';

export interface IsolatedAssetWarningProps extends React.HTMLAttributes<HTMLDivElement> {
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
  ...otherProps
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
    <div css={styles.container} className={className} {...otherProps}>
      <Notice
        css={styles.notice}
        variant="warning"
        description={
          <>
            <div css={styles.description}>
              {type === 'borrow'
                ? t('isolatedAssetWarning.borrowDescription', translationArgs)
                : t('isolatedAssetWarning.supplyDescription', translationArgs)}
            </div>

            <TextButton css={styles.inlineButton} onClick={handleShowAssets}>
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
