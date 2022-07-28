/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import React from 'react';
import { useTranslation } from 'translation';
import { formatCentsToReadableValue } from 'utilities';

import { useGetTreasuryTotals } from 'clients/api';

import { useStyles } from '../styles';

interface HeaderProps {
  totalSupplyCents: BigNumber;
  totalBorrowCents: BigNumber;
  availableLiquidityCents: BigNumber;
  totalTreasuryCents: BigNumber;
}

export const HeaderUi: React.FC<HeaderProps> = ({
  totalSupplyCents,
  totalBorrowCents,
  availableLiquidityCents,
  totalTreasuryCents,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  return (
    <Paper css={styles.headerRoot}>
      <div css={styles.row}>
        <Paper css={styles.box}>
          <Typography variant="small1" css={styles.title}>
            {t('market.totalSupply')}
          </Typography>
          <Typography variant="h3" css={styles.value}>
            {formatCentsToReadableValue({ value: totalSupplyCents })}
          </Typography>
        </Paper>
        <Paper css={styles.box}>
          <Typography variant="small1" css={styles.title}>
            {t('market.totalBorrow')}
          </Typography>
          <Typography variant="h3" css={styles.value}>
            {formatCentsToReadableValue({ value: totalBorrowCents })}
          </Typography>
        </Paper>
        <Paper css={styles.box}>
          <Typography variant="small1" css={styles.title}>
            {t('market.availableLiquidity')}
          </Typography>
          <Typography variant="h3" css={styles.value}>
            {formatCentsToReadableValue({ value: availableLiquidityCents })}
          </Typography>
        </Paper>
        <Paper css={styles.box}>
          <Typography variant="small1" css={styles.title}>
            {t('market.totalTreasury')}
          </Typography>
          <Typography variant="h3" css={styles.value}>
            {formatCentsToReadableValue({ value: totalTreasuryCents })}
          </Typography>
        </Paper>
      </div>
    </Paper>
  );
};

const Header = () => {
  // TODO: handle loading state (see https://app.clickup.com/t/2d4rcee)
  const {
    data: {
      treasuryTotalSupplyBalanceCents,
      treasuryTotalBorrowBalanceCents,
      treasuryTotalAvailableLiquidityBalanceCents,
      treasuryTotalBalanceCents,
    },
  } = useGetTreasuryTotals();

  return (
    <HeaderUi
      totalSupplyCents={treasuryTotalSupplyBalanceCents}
      totalBorrowCents={treasuryTotalBorrowBalanceCents}
      availableLiquidityCents={treasuryTotalAvailableLiquidityBalanceCents}
      totalTreasuryCents={treasuryTotalBalanceCents}
    />
  );
};

export default Header;
