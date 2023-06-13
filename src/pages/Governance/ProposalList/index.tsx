/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { InfoIcon, Pagination, Spinner, TextButton } from 'components';
import { ContractReceipt } from 'ethers';
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { Proposal } from 'types';

import {
  CreateProposalInput,
  useCreateProposal,
  useGetCurrentVotes,
  useGetLatestProposalIdByProposer,
  useGetProposalState,
  useGetProposals,
} from 'clients/api';
import CREATE_PROPOSAL_THRESHOLD_WEI from 'constants/createProposalThresholdWei';
import { useAuth } from 'context/AuthContext';
import { UseUrlPaginationOutput } from 'hooks/useUrlPagination';

import CreateProposalModal from './CreateProposalModal';
import GovernanceProposal from './GovernanceProposal';
import { useStyles } from './styles';

interface ProposalListUiProps {
  proposals: Proposal[];
  isLoading: boolean;
  total: number | undefined;
  limit: number;
  setCurrentPage: (page: number) => void;
  createProposal: (
    payload: Omit<CreateProposalInput, 'accountAddress'>,
  ) => Promise<ContractReceipt>;
  isCreateProposalLoading: boolean;
  canCreateProposal: boolean;
}

export const ProposalListUi: React.FC<ProposalListUiProps> = ({
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
        <Typography variant="h4">{t('vote.proposals')}</Typography>

        <div css={styles.createProposal}>
          <TextButton
            onClick={() => setShowCreateProposalModal(true)}
            css={styles.marginLess}
            disabled={!canCreateProposal}
          >
            {t('vote.createProposalPlus')}
          </TextButton>

          <InfoIcon tooltip={t('vote.requiredVotingPower')} css={styles.infoIconWrapper} />
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
            cancelDate,
            queuedDate,
            forVotesWei,
            abstainedVotesWei,
            againstVotesWei,
            executedDate,
            proposalType,
          }) => (
            <GovernanceProposal
              key={id}
              css={styles.bottomSpace}
              proposalId={id}
              proposalTitle={description.title}
              proposalState={state}
              endDate={endDate}
              executedDate={executedDate}
              cancelDate={cancelDate}
              queuedDate={queuedDate}
              forVotesWei={forVotesWei}
              againstVotesWei={againstVotesWei}
              abstainedVotesWei={abstainedVotesWei}
              proposalType={proposalType}
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

export type ProposalListPageProps = UseUrlPaginationOutput;

const ProposalList: React.FC<ProposalListPageProps> = ({ currentPage, setCurrentPage }) => {
  const { accountAddress } = useAuth();

  const {
    data: { proposals, total, limit = 5 } = { proposals: [] },
    isLoading,
    isFetching: isGetProposalsFetching,
    isPreviousData: isGetProposalsPreviousData,
  } = useGetProposals({
    page: currentPage,
  });

  const isFetchingProposals = isLoading || (isGetProposalsFetching && isGetProposalsPreviousData);

  const { mutateAsync: createProposal, isLoading: isCreateProposalLoading } = useCreateProposal();

  const { data: currentVotesData } = useGetCurrentVotes(
    { accountAddress },
    { enabled: !!accountAddress },
  );

  const { data: latestProposalData } = useGetLatestProposalIdByProposer(
    { accountAddress },
    { enabled: !!accountAddress },
  );

  const { data: latestProposalStateData } = useGetProposalState(
    { proposalId: latestProposalData?.proposalId || '' },
    { enabled: !!latestProposalData?.proposalId },
  );

  // User has enough votingWeight to create proposal and doesn't currently have an active or pending proposal
  const canCreateProposal =
    currentVotesData?.votesWei.isGreaterThanOrEqualTo(CREATE_PROPOSAL_THRESHOLD_WEI) &&
    latestProposalStateData?.state !== 0 &&
    latestProposalStateData?.state !== 1;

  return (
    <ProposalListUi
      proposals={proposals}
      isLoading={isFetchingProposals}
      total={total}
      limit={limit}
      setCurrentPage={setCurrentPage}
      canCreateProposal={!!canCreateProposal}
      createProposal={createProposal}
      isCreateProposalLoading={isCreateProposalLoading}
    />
  );
};

export default ProposalList;
