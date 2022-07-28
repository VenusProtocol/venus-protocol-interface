/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Icon, Pagination, Spinner, TextButton, Tooltip } from 'components';
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { Proposal } from 'types';
import type { TransactionReceipt } from 'web3-core';

import {
  CreateProposalInput,
  useCreateProposal,
  useGetCurrentVotes,
  useGetLatestProposalIdByProposer,
  useGetProposalState,
  useGetProposals,
} from 'clients/api';
import CREATE_PROPOSAL_THRESHOLD_WEI from 'constants/createProposalThresholdWei';
import { AuthContext } from 'context/AuthContext';

import CreateProposalModal from '../CreateProposalModal';
import GovernanceProposal from '../GovernanceProposal';
import { useStyles } from './styles';

interface GovernanceUiProps {
  proposals: Proposal[];
  isLoading: boolean;
  total: number | undefined;
  limit: number;
  setCurrentPage: (page: number) => void;
  createProposal: (
    payload: Omit<CreateProposalInput, 'accountAddress'>,
  ) => Promise<TransactionReceipt>;
  isCreateProposalLoading: boolean;
  canCreateProposal: boolean;
}

export const GovernanceUi: React.FC<GovernanceUiProps> = ({
  proposals,
  isLoading,
  total,
  limit,
  setCurrentPage,
  createProposal,
  isCreateProposalLoading,
  canCreateProposal,
}) => {
  const [showCreateProposalModal, setShowCreateProposalModal] = useState(false);
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <div css={styles.root}>
      <div css={[styles.header, styles.bottomSpace]}>
        <Typography variant="h4">{t('vote.governanceProposals')}</Typography>

        <div css={styles.createProposal}>
          <TextButton
            onClick={() => setShowCreateProposalModal(true)}
            css={styles.marginLess}
            disabled={!canCreateProposal}
          >
            {t('vote.createProposalPlus')}
          </TextButton>

          <Tooltip title={t('vote.requiredVotingPower')} css={styles.infoIconWrapper}>
            <Icon name="info" css={styles.infoIcon} />
          </Tooltip>
        </div>
      </div>

      {isLoading && <Spinner css={styles.loader} />}

      <div>
        {proposals.map(
          ({
            id,
            description,
            state,
            endDate,
            forVotesWei,
            abstainedVotesWei,
            againstVotesWei,
          }) => (
            <GovernanceProposal
              key={id}
              css={styles.bottomSpace}
              proposalId={id}
              proposalTitle={description.title}
              proposalState={state}
              endDate={endDate}
              forVotesWei={forVotesWei}
              againstVotesWei={againstVotesWei}
              abstainedVotesWei={abstainedVotesWei}
            />
          ),
        )}
      </div>

      {!!total && total > 0 && (
        <Pagination
          css={styles.pagination}
          itemsCount={total}
          onChange={(nextIndex: number) => {
            setCurrentPage(nextIndex);
            window.scrollTo(0, 0);
          }}
          itemsPerPageCount={limit}
        />
      )}

      {showCreateProposalModal && (
        <CreateProposalModal
          isOpen={showCreateProposalModal}
          handleClose={() => setShowCreateProposalModal(false)}
          createProposal={createProposal}
          isCreateProposalLoading={isCreateProposalLoading}
        />
      )}
    </div>
  );
};

const Governance: React.FC = () => {
  const { account } = React.useContext(AuthContext);
  const accountAddress = account?.address || '';
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: { proposals, total, limit = 5 } = { proposals: [] },
    isFetching: isGetProposalsFetching,
  } = useGetProposals({
    page: currentPage,
  });

  const { mutateAsync: createProposal, isLoading: isCreateProposalLoading } = useCreateProposal();

  const { data: currentVotesWei } = useGetCurrentVotes(
    { accountAddress },
    { enabled: !!accountAddress },
  );

  const { data: latestProposal } = useGetLatestProposalIdByProposer(
    { accountAddress },
    { enabled: !!accountAddress },
  );

  const { data: latestProposalState } = useGetProposalState(
    { proposalId: latestProposal || '' },
    { enabled: !!latestProposal },
  );

  // User has enough votingWeight to create proposal and doesn't currently have an active or pending proposal
  const canCreateProposal =
    currentVotesWei?.isGreaterThanOrEqualTo(CREATE_PROPOSAL_THRESHOLD_WEI) &&
    latestProposalState !== '0' &&
    latestProposalState !== '1';

  return (
    <GovernanceUi
      proposals={proposals}
      isLoading={isGetProposalsFetching}
      total={total}
      limit={limit}
      setCurrentPage={setCurrentPage}
      canCreateProposal={!!canCreateProposal}
      createProposal={payload => createProposal({ ...payload, accountAddress })}
      isCreateProposalLoading={isCreateProposalLoading}
    />
  );
};

export default Governance;
