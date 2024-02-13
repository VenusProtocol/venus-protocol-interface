/** @jsxImportSource @emotion/react */
import { useTranslation } from 'libs/translations';
import { useState } from 'react';

import { Pool, Token } from 'types';

import { TextButton } from '../Button';
import { Notice } from '../Notice';
import AssetTable from './AssetTable';
import { useStyles } from './styles';
import { WarningType } from './types';

export interface AssetWarningProps extends React.HTMLAttributes<HTMLDivElement> {
  type: WarningType;
  token: Token;
  pool?: Pool;
  className?: string;
}

export const AssetWarning: React.FC<AssetWarningProps> = ({
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
                ? t('assetWarning.borrowDescription', translationArgs)
                : t('assetWarning.supplyDescription', translationArgs)}
            </div>

            <TextButton css={styles.inlineButton} onClick={handleShowAssets}>
              {t('assetWarning.showMarketsButtonLabel', {
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

export default AssetWarning;
