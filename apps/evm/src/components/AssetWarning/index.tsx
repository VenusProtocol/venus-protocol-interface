/** @jsxImportSource @emotion/react */
import { useState } from 'react';

import { useTranslation } from 'libs/translations';
import type { Pool, Token } from 'types';

import { TextButton } from '../Button';
import { Notice } from '../Notice';
import AssetTable from './AssetTable';
import { useStyles } from './styles';
import type { WarningType } from './types';

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
  const { t, Trans } = useTranslation();

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
          <Trans
            i18nKey={
              type === 'borrow'
                ? 'assetWarning.borrowDescription'
                : 'assetWarning.supplyDescription'
            }
            values={translationArgs}
            components={{
              Button: (
                <TextButton className="p-0 h-auto" onClick={handleShowAssets}>
                  {t('assetWarning.showMarketsButtonLabel', {
                    poolName: pool.name,
                  })}
                </TextButton>
              ),
            }}
          />
        }
      />

      {showAssets && (
        <AssetTable assets={pool.assets} type={type} onHideAssetsButtonClick={handleHideAssets} />
      )}
    </div>
  );
};

export default AssetWarning;
