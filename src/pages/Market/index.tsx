import { Cell, CellGroup } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { formatCentsToReadableValue } from 'utilities';

import { assetData } from '__mocks__/models/asset';

export interface MarketUiProps {
  assets: Asset[];
  totalSupplyCents: number;
  totalBorrowCents: number;
}

export const MarketUi: React.FC<MarketUiProps> = ({
  assets,
  totalSupplyCents,
  totalBorrowCents,
}) => {
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

  return <CellGroup cells={cells} />;
};

const Market: React.FC = () => {
  // TODO: fetch actual values (see https://jira.toolsfdg.net/browse/VEN-546)
  const assets = assetData;
  const totalSupplyCents = 1000000000;
  const totalBorrowCents = 100000000;

  return (
    <MarketUi
      assets={assets}
      totalSupplyCents={totalSupplyCents}
      totalBorrowCents={totalBorrowCents}
    />
  );
};

export default Market;
