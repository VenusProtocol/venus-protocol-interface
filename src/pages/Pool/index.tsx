/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Cell, CellGroup, Icon } from 'components';
import React, { useMemo } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'translation';
import { Pool } from 'types';
import { formatCentsToReadableValue } from 'utilities';

import { poolData } from '__mocks__/models/pools';

import Table from './Table';
import { useStyles } from './styles';

export interface PoolUiProps {
  pool: Pool;
}

export const PoolUi: React.FC<PoolUiProps> = ({ pool }) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  const cells: Cell[] = useMemo(() => {
    const { totalSupplyCents, totalBorrowCents } = pool.assets.reduce(
      (acc, item) => ({
        totalSupplyCents: item.treasuryTotalSupplyCents.plus(acc.totalSupplyCents).toNumber(),
        totalBorrowCents: item.treasuryTotalBorrowsCents.plus(acc.totalBorrowCents).toNumber(),
      }),
      {
        totalSupplyCents: 0,
        totalBorrowCents: 0,
      },
    );

    return [
      {
        label: t('pool.header.totalSupplyLabel'),
        value: formatCentsToReadableValue({
          value: totalSupplyCents,
        }),
      },
      {
        label: t('pool.header.totalBorrowLabel'),
        value: formatCentsToReadableValue({
          value: totalBorrowCents,
        }),
      },
      {
        label: t('pool.header.availableLiquidityLabel'),
        value: formatCentsToReadableValue({
          value: totalSupplyCents - totalBorrowCents,
        }),
      },
      {
        label: t('pool.header.assetsLabel'),
        value: pool.assets.length,
      },
    ];
  }, [pool]);

  return (
    <>
      <div css={styles.header}>
        <Typography variant="small2" component="div" css={styles.headerDescription}>
          {pool.description}
        </Typography>

        <CellGroup cells={cells} />
      </div>

      {pool.isIsolated && (
        <div css={styles.banner}>
          <div css={styles.bannerContent}>
            <Icon name="attention" css={styles.bannerIcon} />

            <Typography variant="small2" css={styles.bannerText}>
              <Trans
                i18nKey="pool.bannerText"
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

      <Table pool={pool} />
    </>
  );
};

export type PoolPageProps = RouteComponentProps<{ poolId: string }>;

const PoolPage: React.FC<PoolPageProps> = ({
  match: {
    params: { poolId },
  },
}) => {
  // TODO: fetch actual value (see VEN-546)
  const pool = {
    ...poolData[0],
    id: poolId,
  };

  // TODO: redirect to pools page if pool ID is incorrect (see VEN-546)

  return <PoolUi pool={pool} />;
};

export default PoolPage;
