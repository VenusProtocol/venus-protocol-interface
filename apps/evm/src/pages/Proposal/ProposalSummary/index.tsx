/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { isAfter } from 'date-fns/isAfter';
import { useMemo } from 'react';

import {
  useCancelProposal,
  useExecuteProposal,
  useGetCurrentVotes,
  useGetProposalEta,
  useGetProposalThreshold,
  useQueueProposal,
} from 'clients/api';
import {
  Card,
  Chip,
  Countdown,
  PrimaryButton,
  ProposalTypeChip,
  SecondaryButton,
} from 'components';
import { ChainExplorerLink } from 'containers/ChainExplorerLink';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { governanceChain, useAccountAddress } from 'libs/wallet';
import { type Proposal, ProposalState, ProposalType } from 'types';
import { areAddressesEqual } from 'utilities';

import Stepper from './Stepper';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

interface ProposalSummaryUiProps {
  className?: string;
  proposal: Proposal;
}

interface ProposalSummaryContainerProps {
  cancelProposal: () => Promise<unknown>;
  executeProposal: () => Promise<unknown>;
  queueProposal: () => Promise<unknown>;
  isCancelProposalLoading: boolean;
  isExecuteProposalLoading: boolean;
  isQueueProposalLoading: boolean;
  canCancelProposal: boolean;
  proposalEta?: Date;
}

export const ProposalSummaryUi: React.FC<ProposalSummaryUiProps & ProposalSummaryContainerProps> =
  ({
    className,
    proposal,
    cancelProposal,
    queueProposal,
    executeProposal,
    isCancelProposalLoading,
    isExecuteProposalLoading,
    isQueueProposalLoading,
    canCancelProposal,
    proposalEta,
  }) => {
    const styles = useStyles();
    const { t, Trans } = useTranslation();
    const isVoteProposalFeatureEnabled = useIsFeatureEnabled({ name: 'voteProposal' });
    const isMultichainGovernanceFeatureEnabled = useIsFeatureEnabled({
      name: 'multichainGovernance',
    });

    const {
      state,
      proposalId,
      description: { title },
      createdDate,
      createdTxHash,
      startDate,
      cancelDate,
      queuedDate,
      executedDate,
      endDate,
      proposalType,
      expiredDate,
    } = proposal;

    const handleCancelProposal = async () => {
      try {
        await cancelProposal();
      } catch (error) {
        handleError({ error });
      }
    };

    const handleQueueProposal = async () => {
      try {
        await queueProposal();
      } catch (error) {
        handleError({ error });
      }
    };

    const handleExecuteProposal = async () => {
      try {
        await executeProposal();
      } catch (error) {
        handleError({ error });
      }
    };

    let updateProposalButton: JSX.Element | undefined;
    const isExecuteEtaInFuture = !!proposalEta && isAfter(proposalEta, new Date());

    switch (state) {
      case ProposalState.Active:
        updateProposalButton = (
          <SecondaryButton
            onClick={handleCancelProposal}
            css={styles.updateProposalButton}
            loading={isCancelProposalLoading}
            data-testid={TEST_IDS.cancelButton}
            disabled={!canCancelProposal}
          >
            {t('voteProposalUi.cancelButtonLabel')}
          </SecondaryButton>
        );
        break;
      case ProposalState.Succeeded:
        updateProposalButton = (
          <PrimaryButton
            onClick={handleQueueProposal}
            css={styles.updateProposalButton}
            loading={isQueueProposalLoading}
            data-testid={TEST_IDS.queueButton}
          >
            {t('voteProposalUi.queueButtonLabel')}
          </PrimaryButton>
        );
        break;
      case ProposalState.Queued:
        if (!isExecuteEtaInFuture) {
          updateProposalButton = (
            <PrimaryButton
              onClick={handleExecuteProposal}
              css={styles.updateProposalButton}
              loading={isExecuteProposalLoading}
              data-testid={TEST_IDS.executeButton}
            >
              {t('voteProposalUi.executeButtonLabel')}
            </PrimaryButton>
          );
        }
        break;
      // no default
    }

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

      if (state === ProposalState.Queued && isExecuteEtaInFuture) {
        return {
          date: proposalEta,
          // DO NOT REMOVE COMMENT: needed by i18next to extract translation key
          // t('voteProposalUi.timeUntilExecutable')
          i18nKey: 'voteProposalUi.timeUntilExecutable',
        };
      }
    }, [state, endDate, startDate, proposalEta, isExecuteEtaInFuture]);

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

          <div css={styles.content}>
            <div>
              <Typography variant="h3" css={styles.title}>
                {title}
              </Typography>

              {createdTxHash && (
                <ChainExplorerLink
                  text={createdTxHash}
                  urlType="tx"
                  hash={createdTxHash}
                  ellipseBreakpoint="xxl"
                  chainId={governanceChain.id}
                />
              )}
            </div>

            {isVoteProposalFeatureEnabled &&
              !isMultichainGovernanceFeatureEnabled &&
              updateProposalButton}
          </div>
        </div>

        {!isMultichainGovernanceFeatureEnabled && (
          <div css={styles.rightSection}>
            <Typography css={styles.rightTitle}>{t('voteProposalUi.proposalHistory')}</Typography>

            <Stepper
              expiredDate={expiredDate}
              createdDate={createdDate}
              startDate={startDate}
              cancelDate={cancelDate}
              queuedDate={queuedDate}
              executedDate={executedDate}
              endDate={endDate}
              state={state}
            />
          </div>
        )}
      </Card>
    );
  };

const ProposalSummary: React.FC<ProposalSummaryUiProps> = ({ className, proposal }) => {
  const { accountAddress } = useAccountAddress();
  const { proposalId } = proposal;

  const { mutateAsync: cancelProposal, isPending: isCancelProposalLoading } = useCancelProposal();
  const { mutateAsync: executeProposal, isPending: isExecuteProposalLoading } =
    useExecuteProposal();
  const { mutateAsync: queueProposal, isPending: isQueueProposalLoading } = useQueueProposal();

  const handleCancelProposal = () => cancelProposal({ proposalId });
  const handleExecuteProposal = () => executeProposal({ proposalId, chainId: governanceChain.id });
  const handleQueueProposal = () => queueProposal({ proposalId });

  const { data: proposalThresholdData } = useGetProposalThreshold();

  const { data: getProposalEtaData } = useGetProposalEta({
    proposalId,
  });

  const { data: proposerVotesData } = useGetCurrentVotes(
    { accountAddress: proposal.proposerAddress },
    { enabled: !!accountAddress },
  );

  const canCancelProposal =
    areAddressesEqual(proposal.proposerAddress, accountAddress || '') ||
    (proposalThresholdData?.thresholdMantissa &&
      proposerVotesData?.votesMantissa.isLessThan(proposalThresholdData.thresholdMantissa));

  return (
    <ProposalSummaryUi
      className={className}
      proposal={proposal}
      proposalEta={getProposalEtaData?.eta}
      cancelProposal={handleCancelProposal}
      executeProposal={handleExecuteProposal}
      queueProposal={handleQueueProposal}
      isCancelProposalLoading={isCancelProposalLoading}
      isExecuteProposalLoading={isExecuteProposalLoading}
      isQueueProposalLoading={isQueueProposalLoading}
      canCancelProposal={!!canCancelProposal}
    />
  );
};

export default ProposalSummary;
