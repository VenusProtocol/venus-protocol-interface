/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Cell, CellGroup } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { formatCentsToReadableValue } from 'utilities';

import { assetData } from '__mocks__/models/asset';

import { useStyles } from './styles';

export interface MarketUiProps {
  assets: Asset[];
  totalSupplyCents: number;
  totalBorrowCents: number;
  description: string;
}

export const MarketUi: React.FC<MarketUiProps> = ({
  assets,
  totalSupplyCents,
  totalBorrowCents,
  description,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const cells: Cell[] = useMemo(
    () => [
      {
        label: t('market.header.totalSupplyLabel'),
        value: formatCentsToReadableValue({
          value: totalSupplyCents,
        }),
      },
      {
        label: t('market.header.totalBorrowLabel'),
        value: formatCentsToReadableValue({
          value: totalBorrowCents,
        }),
      },
      {
        label: t('market.header.availableLiquidityLabel'),
        value: formatCentsToReadableValue({
          value: totalSupplyCents - totalBorrowCents,
        }),
      },
      {
        label: t('market.header.assetsLabel'),
        value: assets.length,
      },
    ],
    [totalSupplyCents, totalBorrowCents, assets.length],
  );

  return (
    <div css={styles.header}>
      <Typography variant="small2" component="div" css={styles.headerDescription}>
        {description}
      </Typography>

      <CellGroup cells={cells} />
    </div>
  );
};

const Market: React.FC = () => {
  // TODO: fetch actual values (see https://jira.toolsfdg.net/browse/VEN-546)
  const assets = assetData;
  const totalSupplyCents = 1000000000;
  const totalBorrowCents = 100000000;
  const description =
    'The Metaverse pool offers increased LTV to allow  a leveraged SOL position up to 10x. Higher leverage comes at the cost of increased liquidation risk so proceed with caution.';

  return (
    <MarketUi
      assets={assets}
      totalSupplyCents={totalSupplyCents}
      totalBorrowCents={totalBorrowCents}
      description={description}
    />
  );
};

export default Market;
