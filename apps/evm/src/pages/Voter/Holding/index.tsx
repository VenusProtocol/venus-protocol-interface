/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import type BigNumber from 'bignumber.js';

import { Card, Delimiter, Icon } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';

import { useStyles } from './styles';

interface HoldingProps {
  className?: string;
  balanceMantissa: BigNumber | undefined;
  delegateCount: number | undefined;
  votesMantissa: BigNumber | undefined;
  delegating: boolean;
}

export const Holding: React.FC<HoldingProps> = ({
  className,
  balanceMantissa,
  delegateCount,
  votesMantissa,
  delegating,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const readableVenusBalance = useConvertMantissaToReadableTokenString({
    value: balanceMantissa,
    token: xvs,
    addSymbol: false,
  });

  const readableVotes = useConvertMantissaToReadableTokenString({
    value: votesMantissa,
    token: xvs,
    addSymbol: false,
  });

  return (
    <Card css={styles.root} className={className}>
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
    </Card>
  );
};

export default Holding;
