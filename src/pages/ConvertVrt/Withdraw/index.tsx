/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { Typography } from '@mui/material';
import { PrimaryButton } from 'components';
import useConvertToReadableCoinString from 'utilities/useConvertToReadableCoinString';
import { useTranslation } from 'translation';
import { XVS_ID } from '../constants';
import { useStyles } from '../styles';

interface WithdrawProps {
  xvsTotal: BigNumber;
}

const Withdraw: React.FC<WithdrawProps> = ({ xvsTotal }) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const readableXvsAvailable = useConvertToReadableCoinString({
    valueWei: xvsTotal,
    tokenId: XVS_ID,
  });
  return (
    <div css={styles.root}>
      <section css={styles.title}>
        <Typography variant="h3">{readableXvsAvailable}</Typography>
        <Typography variant="small2">{t('convertVrt.withdrawableAmount')}</Typography>
      </section>
      <div css={styles.inputSection}>
        <PrimaryButton fullWidth>{t('convertVrt.withdrawXvs')}</PrimaryButton>
      </div>
    </div>
  );
};

export default Withdraw;
