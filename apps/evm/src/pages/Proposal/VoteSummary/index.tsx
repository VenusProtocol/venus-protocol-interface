/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { BigNumber } from 'bignumber.js';
import { useCallback } from 'react';

import { Button, EllipseAddress, Icon, LabeledProgressBar, Tooltip } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { VotersDetails } from 'types';
import { convertMantissaToTokens } from 'utilities';

import { useStyles } from './styles';

interface VoteSummaryProps {
  label: string;
  progressBarColor: string;
  votedValueMantissa?: BigNumber;
  votedTotalMantissa?: BigNumber;
  voters?: VotersDetails['result'];
  className?: string;
  votingEnabled: boolean;
  openVoteModal: () => void;
  testId?: string;
}

const VoteSummary = ({
  openVoteModal,
  label,
  progressBarColor,
  votedTotalMantissa = new BigNumber(0),
  votedValueMantissa = new BigNumber(0),
  voters = [],
  className,
  votingEnabled,
  testId,
}: VoteSummaryProps) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const getVoteWeight = useCallback(
    (voteWeightWei: BigNumber) =>
      convertMantissaToTokens({
        value: voteWeightWei,
        token: xvs,
        addSymbol: false,
        returnInReadableFormat: true,
      }),
    [xvs],
  );

  return (
    <Paper css={styles.root} className={className} data-testid={testId}>
      <div css={styles.topSection}>
        <div css={styles.labeledProgressBarContainer}>
          <LabeledProgressBar
            greyLeftText={label}
            whiteRightText={getVoteWeight(votedValueMantissa || new BigNumber(0))}
            value={votedValueMantissa.toNumber()}
            min={0}
            // If there are no votes set a fallback to zero the progressbar
            max={votedTotalMantissa.toNumber() || 100}
            step={1}
            ariaLabel={t('vote.summaryProgressBar', { voteType: label })}
            progressBarColor={progressBarColor}
          />
        </div>

        {votingEnabled && (
          <Button css={styles.button} onClick={openVoteModal}>
            {label}
          </Button>
        )}
      </div>

      <div css={styles.votesHeader}>
        <Typography>{t('voteSummary.addresses', { count: voters.length })}</Typography>
        <Typography>{t('voteSummary.votes')}</Typography>
      </div>

      <ul css={styles.votesWrapper}>
        {voters.map(({ address, votesMantissa, reason }) => (
          <li key={address} css={styles.voteFrom}>
            <div css={styles.address}>
              <Link
                to={routes.governanceVoter.path.replace(':address', address)}
                css={[styles.blueText, styles.addressText]}
              >
                <EllipseAddress address={address} />
              </Link>

              {reason && (
                <Tooltip title={reason}>
                  <Icon name="bubble" />
                </Tooltip>
              )}
            </div>

            <Typography color="text.primary">
              {convertMantissaToTokens({
                value: votesMantissa,
                token: xvs,
                addSymbol: false,
                returnInReadableFormat: true,
              })}
            </Typography>
          </li>
        ))}
      </ul>
    </Paper>
  );
};

export default VoteSummary;
