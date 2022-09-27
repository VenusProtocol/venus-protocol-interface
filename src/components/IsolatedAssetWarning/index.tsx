/** @jsxImportSource @emotion/react */
import React from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool } from 'types';
import { getToken } from 'utilities';

import { poolData } from '__mocks__/models/pools';

import { TextButton } from '../Button';
import { Notice } from '../Notice';
import { useStyles } from './styles';

type WarningType = 'borrow' | 'supply';

export interface IsolatedAssetWarningUiProps {
  assetId: Asset['id'];
  pool: Pool;
  type: WarningType;
}

export const IsolatedAssetWarningUi: React.FC<IsolatedAssetWarningUiProps> = ({
  pool,
  assetId,
  type,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const token = getToken(assetId);
  const translationArgs = {
    poolName: pool.name,
    tokenSymbol: token.symbol,
  };

  const handleShowMarkets = () => {
    // TODO: display market table
  };

  return (
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

          <TextButton css={styles.showMarketsButton} onClick={handleShowMarkets} small>
            {t('isolatedAssetWarning.showMarketsButtonLabel', {
              poolName: pool.name,
            })}
          </TextButton>
        </>
      }
    />
  );
};

export interface IsolatedAssetWarningProps {
  assetId: Asset['id'];
  poolId: Pool['id'];
  type: WarningType;
}

export const IsolatedAssetWarning: React.FC<IsolatedAssetWarningProps> = ({ assetId, type }) => {
  // TODO: fetch actual value (see VEN-546)

  const pool = poolData[0];

  return <IsolatedAssetWarningUi assetId={assetId} pool={pool} type={type} />;
};

export default IsolatedAssetWarning;
