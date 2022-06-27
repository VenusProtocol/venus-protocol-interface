/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Paper, Typography } from '@mui/material';
import { Delimiter, LabeledProgressBar, Icon } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useTranslation } from 'translation';
import { convertWeiToTokens } from 'utilities';
import { useStyles } from './styles';

interface IHoldingProps {
  className?: string;
  balanceWei: BigNumber | undefined;
  delegateCount: number | undefined;
  votesWei: BigNumber | undefined;
  delegating: boolean;
}

export const Holding: React.FC<IHoldingProps> = ({
  className,
  balanceWei,
  delegateCount,
  votesWei,
  delegating,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const readableVenusBalance = useMemo(() => {
    if (!balanceWei) {
      return PLACEHOLDER_KEY;
    }
    return convertWeiToTokens({
      valueWei: balanceWei,
      tokenId: 'xvs',
      addSymbol: false,
      returnInReadableFormat: true,
    });
  }, [balanceWei]);

  const readableVotes = useMemo(() => {
    if (!votesWei) {
      return PLACEHOLDER_KEY;
    }
    return convertWeiToTokens({
      valueWei: votesWei,
      tokenId: 'xvs',
      addSymbol: false,
      returnInReadableFormat: true,
    });
  }, [votesWei]);
  return (
    <Paper css={styles.root} className={className}>
      <Typography variant="h4" css={styles.title}>
        {t('voterDetail.holding')}
      </Typography>
      <Typography variant="small2">{t('voterDetail.venusBalance')}</Typography>
      <Typography variant="h4" css={styles.value}>
        {readableVenusBalance}
      </Typography>
      <Delimiter css={styles.delimiter} />
      <Typography variant="small2">{t('voterDetail.votes')}</Typography>
      <LabeledProgressBar
        whiteLeftText={readableVotes}
        greyRightText={
          <>
            <Icon name="person" />
            <Typography component="span" css={styles.progressBarTitle}>
              {delegateCount?.toString() || PLACEHOLDER_KEY}
            </Typography>
          </>
        }
        value={100}
        step={1}
        min={0}
        max={100}
        ariaLabel={t('voterDetail.holdingProgressBar')}
      />
      <Delimiter css={styles.delimiter} />
      <Typography variant="small2">{t('voterDetail.delegatingTo')}</Typography>
      <Typography variant="h4" css={styles.value}>
        {delegating ? t('voterDetail.delegated') : t('voterDetail.undelegated')}
      </Typography>
    </Paper>
  );
};

export default Holding;
