/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';
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
