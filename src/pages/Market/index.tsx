/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Cell, CellGroup, Icon } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { formatCentsToReadableValue } from 'utilities';

import { assetData } from '__mocks__/models/asset';
import useUpdateBreadcrumbNavigation from 'hooks/useUpdateBreadcrumbNavigation';

import Table from './Table';
import { useStyles } from './styles';

export interface MarketUiProps {
  marketName: string;
  assets: Asset[];
  isIsolatedLendingMarket: boolean;
  totalSupplyCents: number;
  totalBorrowCents: number;
  description: string;
}

export const MarketUi: React.FC<MarketUiProps> = ({
  marketName,
  assets,
  isIsolatedLendingMarket,
  totalSupplyCents,
  totalBorrowCents,
  description,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  useUpdateBreadcrumbNavigation(
    currentPathNodes =>
      currentPathNodes.concat([
        {
          dom: marketName,
        },
      ]),
    [],
  );

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
    <>
      <div css={styles.header}>
        <Typography variant="small2" component="div" css={styles.headerDescription}>
          {description}
        </Typography>

        <CellGroup cells={cells} />
      </div>

      {isIsolatedLendingMarket && (
        <div css={styles.banner}>
          <div css={styles.bannerContent}>
            <Icon name="attention" css={styles.bannerIcon} />

            <Typography variant="small2" css={styles.bannerText}>
              <Trans
                i18nKey="market.bannerText"
                components={{
                  Link: (
                    <Typography
                      variant="small2"
                      component="a"
                      // TODO: add href
                      href="TBD"
                      target="_blank"
                      rel="noreferrer"
                    />
                  ),
                }}
              />
            </Typography>
          </div>
        </div>
      )}

      <Table assets={assets} />
    </>
  );
};

const Market: React.FC = () => {
  // TODO: fetch actual values (see VEN-546)
  const marketName = 'Venus';
  const assets = assetData;
  const isIsolatedLendingMarket = true;
  const totalSupplyCents = 1000000000;
  const totalBorrowCents = 100000000;
  const description =
    'The Metaverse pool offers increased LTV to allow  a leveraged SOL position up to 10x. Higher leverage comes at the cost of increased liquidation risk so proceed with caution.';

  return (
    <MarketUi
      marketName={marketName}
      assets={assets}
      isIsolatedLendingMarket={isIsolatedLendingMarket}
      totalSupplyCents={totalSupplyCents}
      totalBorrowCents={totalBorrowCents}
      description={description}
    />
  );
};

export default Market;
