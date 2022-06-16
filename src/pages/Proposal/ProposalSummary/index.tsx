/** @jsxImportSource @emotion/react */
import React from 'react';
import { Paper, Typography } from '@mui/material';
import { ActiveChip, BscLink, Chip, Countdown, PrimaryButton, SecondaryButton } from 'components';
import { IProposal } from 'types';
import { useTranslation } from 'translation';
import Stepper from './Stepper';
import { useStyles } from './styles';

interface IProposalSummaryUiProps {
  className?: string;
  proposal: IProposal;
}

interface IProposalSummaryContainerProps {
  cancelProposal: () => void;
  executeProposal: () => void;
  queProposal: () => void;
}

export const ProposalSummaryUi: React.FC<
  IProposalSummaryUiProps & IProposalSummaryContainerProps
> = ({ className, proposal, cancelProposal, queProposal, executeProposal }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const {
    createdTxHash,
    state,
    id,
    description: { title },
    createdDate,
    startDate,
    cancelDate,
    queuedDate,
    executedDate,
    endDate,
  } = proposal;
  let updateButton = null;
  switch (state) {
    case 'Active':
      updateButton = (
        <SecondaryButton onClick={cancelProposal}>{t('voteProposalUi.cancel')}</SecondaryButton>
      );
      break;
    case 'Succeeded':
      updateButton = <PrimaryButton onClick={queProposal}>{t('voteProposalUi.que')}</PrimaryButton>;
      break;
    case 'Queued':
      updateButton = (
        <PrimaryButton onClick={executeProposal}>{t('voteProposalUi.execute')}</PrimaryButton>
      );
      break;
    default:
      updateButton = null;
  }
  // Cancel secondary while active
  // Queue while Succeed primary
  // execute while que primary
  return (
    <Paper css={styles.root} className={className}>
      <div css={styles.leftSection}>
        <div css={styles.topRow}>
          <div>
            <Chip text={`#${id}`} css={styles.chipSpace} />
            {state === 'Active' && <ActiveChip text={t('voteProposalUi.proposalState.active')} />}
          </div>
          <Countdown date={endDate} />
        </div>
        <div css={styles.content}>
          <div>
            <Typography variant="h3" css={styles.title}>
              {title}
            </Typography>
            {/* Hash per state? */}
            <BscLink text={createdTxHash} urlType="tx" hash={createdTxHash} />
          </div>
          <div>{updateButton}</div>
        </div>
      </div>
      <div css={styles.rightSection}>
        <Typography css={styles.rightTitle}>{t('voteProposalUi.proposalHistory')}</Typography>
        <Stepper
          createdDate={createdDate}
          startDate={startDate}
          cancelDate={cancelDate}
          queuedDate={queuedDate}
          executedDate={executedDate}
          endDate={endDate}
          state={state}
        />
      </div>
    </Paper>
  );
};

const ProposalSummary: React.FC<IProposalSummaryUiProps> = props => {
  const cancelProposal = () => {};
  const executeProposal = () => {};
  const queProposal = () => {};
  return (
    <ProposalSummaryUi
      {...props}
      cancelProposal={cancelProposal}
      executeProposal={executeProposal}
      queProposal={queProposal}
    />
  );
};

export default ProposalSummary;
