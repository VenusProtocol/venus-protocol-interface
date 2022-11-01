/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { Delimiter, Icon } from 'components';
import React from 'react';
import { useTranslation } from 'translation';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { TOKENS } from 'constants/tokens';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';

import { useStyles } from './styles';

interface HoldingProps {
  className?: string;
  balanceWei: BigNumber | undefined;
  delegateCount: number | undefined;
  votesWei: BigNumber | undefined;
  delegating: boolean;
}

export const Holding: React.FC<HoldingProps> = ({
  className,
  balanceWei,
  delegateCount,
  votesWei,
  delegating,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const readableVenusBalance = useConvertWeiToReadableTokenString({
    valueWei: balanceWei,
    token: TOKENS.xvs,
    addSymbol: false,
    minimizeDecimals: true,
  });

  const readableVotes = useConvertWeiToReadableTokenString({
    valueWei: votesWei,
    token: TOKENS.xvs,
    addSymbol: false,
    minimizeDecimals: true,
  });

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
      <div css={styles.voteSection}>
        <Typography variant="h4" css={styles.value}>
          {readableVotes}
        </Typography>
        <div css={styles.delegateSection}>
          <Icon name="person" />
          <Typography variant="h4" color="textSecondary" css={styles.progressBarTitle}>
            {delegateCount?.toString() || PLACEHOLDER_KEY}
          </Typography>
        </div>
      </div>
      <Delimiter css={styles.delimiter} />
      <Typography variant="small2">{t('voterDetail.delegatingTo')}</Typography>
      <Typography variant="h4" css={styles.value}>
        {delegating ? t('voterDetail.delegated') : t('voterDetail.undelegated')}
      </Typography>
    </Paper>
  );
};

export default Holding;
