/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';
import { Paper, Typography } from '@mui/material';
import { useGetUserMarketInfo } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import { useTranslation } from 'translation';
import { formatCentsToReadableValue } from 'utilities/common';
import { useStyles } from '../styles';

interface IHeaderProps {
  totalSupplyCents: BigNumber;
  totalBorrowCents: BigNumber;
  availableLiquidityCents: BigNumber;
  totalTreasuryCents: BigNumber;
}

export const HeaderUi: React.FC<IHeaderProps> = ({
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
  const { account } = useContext(AuthContext);
  // TODO: handle loading state
  const { data: getUserMarketInfoData } = useGetUserMarketInfo({
    accountAddress: account?.address,
  });

  return (
    <HeaderUi
      totalSupplyCents={
        getUserMarketInfoData?.treasuryTotalSupplyUsdBalanceCents || new BigNumber(0)
      }
      totalBorrowCents={
        getUserMarketInfoData?.treasuryTotalBorrowUsdBalanceCents || new BigNumber(0)
      }
      availableLiquidityCents={
        getUserMarketInfoData?.treasuryTotalAvailableLiquidityUsdBalanceCents || new BigNumber(0)
      }
      totalTreasuryCents={getUserMarketInfoData?.treasuryTotalUsdBalanceCents || new BigNumber(0)}
    />
  );
};

export default Header;
