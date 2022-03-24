/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
import { useVaiUser } from 'hooks/useVaiUser';
import { useMarketsUser } from 'hooks/useMarketsUser';
import { Icon } from '../../Icon';
import { useStyles } from './styles';

const format = commaNumber.bindWith(',', '.');

export const CoinInfo = ({ balance, coin }: { balance: BigNumber; coin: 'xvs' | 'vai' }) => {
  const styles = useStyles();

  return (
    <Paper css={styles.coinInfo}>
      <Icon name={coin} size="20px" />
      <Typography variant="small1" noWrap component="span">
        {format(balance.dp(2, 1).toString(10))} {coin.toUpperCase()}
      </Typography>
    </Paper>
  );
};

export const XvsCoinInfo = () => {
  const { userVaiBalance } = useVaiUser();
  return <CoinInfo balance={userVaiBalance} coin="vai" />;
};

export const VaiCoinInfo = () => {
  const { userXvsBalance } = useMarketsUser();
  return <CoinInfo balance={userXvsBalance} coin="xvs" />;
};
