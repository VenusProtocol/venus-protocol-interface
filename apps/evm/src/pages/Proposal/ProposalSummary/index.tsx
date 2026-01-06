/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { useMemo } from 'react';

import { useGetProposalEta } from 'clients/api';
import { Card, Chip, Countdown, ProposalTypeChip } from 'components';
import { ChainExplorerLink } from 'containers/ChainExplorerLink';
import { useTranslation } from 'libs/translations';
import { governanceChainId } from 'libs/wallet';
import { type Proposal, ProposalState, ProposalType } from 'types';

import { useIsProposalExecutable } from 'hooks/useIsProposalExecutable';
import { useStyles } from './styles';

interface ProposalSummaryUiProps {
  className?: string;
  proposal: Proposal;
}

interface ProposalSummaryContainerProps {
  proposalEta?: Date;
}

export const ProposalSummaryUi: React.FC<ProposalSummaryUiProps & ProposalSummaryContainerProps> =
  ({ className, proposal, proposalEta }) => {
    const styles = useStyles();
    const { Trans } = useTranslation();

    const {
      state,
      proposalId,
      description: { title },
      createdTxHash,
      startDate,
      endDate,
      proposalType,
    } = proposal;

    const isProposalExecutable = useIsProposalExecutable({
      executionEtaDate: proposalEta,
      isQueued: state === ProposalState.Queued,
    });

    const countdownData = useMemo(() => {
      if (state === ProposalState.Pending && startDate) {
        return {
          date: startDate,
          // DO NOT REMOVE COMMENT: needed by i18next to extract translation key
          // t('voteProposalUi.timeUntilVotable')
          i18nKey: 'voteProposalUi.timeUntilVotable',
        };
      }

      if (state === ProposalState.Active && endDate) {
        return {
          date: endDate,
          // DO NOT REMOVE COMMENT: needed by i18next to extract translation key
          // t('voteProposalUi.activeUntilDate')
          i18nKey: 'voteProposalUi.activeUntilDate',
        };
      }

      if (state === ProposalState.Queued && proposalEta && !isProposalExecutable) {
        return {
          date: proposalEta,
          // DO NOT REMOVE COMMENT: needed by i18next to extract translation key
          // t('voteProposalUi.timeUntilExecutable')
          i18nKey: 'voteProposalUi.timeUntilExecutable',
        };
      }
    }, [state, endDate, startDate, proposalEta, isProposalExecutable]);

    return (
      <Card css={styles.root} className={className}>
        <div css={styles.leftSection}>
          <div css={styles.topRow}>
            <div css={styles.topRowLeftColumn}>
              <Chip text={`#${proposalId}`} css={styles.chipSpace} />

              {proposalType !== ProposalType.NORMAL && (
                <ProposalTypeChip proposalType={proposalType} />
              )}
            </div>

            {countdownData && (
              <div>
                <Typography variant="small2" css={styles.countdownLabel}>
                  <Trans
                    i18nKey={countdownData.i18nKey}
                    components={{
                      Date: <Typography variant="small2" color="textPrimary" />,
                    }}
                    values={{
                      date: endDate,
                    }}
                  />
                </Typography>
                &nbsp;
                <Countdown date={countdownData.date} css={styles.countdown} />
              </div>
            )}
          </div>

          <div>
            <Typography variant="h3" css={styles.title}>
              {title}
            </Typography>

            {createdTxHash && (
              <ChainExplorerLink
                text={createdTxHash}
                urlType="tx"
                hash={createdTxHash}
                ellipseBreakpoint="2xl"
                chainId={governanceChainId}
              />
            )}
          </div>
        </div>
      </Card>
    );
  };

const ProposalSummary: React.FC<ProposalSummaryUiProps> = ({ className, proposal }) => {
  const { proposalId } = proposal;

  const { data: getProposalEtaData } = useGetProposalEta({
    proposalId,
  });

  return (
    <ProposalSummaryUi
      className={className}
      proposal={proposal}
      proposalEta={getProposalEtaData?.eta}
    />
  );
};

export default ProposalSummary;
