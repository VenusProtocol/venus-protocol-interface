/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { Paper, Typography } from '@mui/material';
import { useTranslation } from 'translation';
import { formatCentsToReadableValue } from 'utilities/common';
import { useStyles } from '../styles';

interface IHeaderProps {
  totalSupplyCents: BigNumber;
  totalBorrowCents: BigNumber;
  availableLiquidityCents: BigNumber;
  totalTreasuryCents: BigNumber;
}

const Header: React.FC<IHeaderProps> = ({
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

export default Header;
