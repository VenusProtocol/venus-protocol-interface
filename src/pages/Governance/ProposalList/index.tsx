/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  CreateProposalInput,
  useCreateProposal,
  useGetCurrentVotes,
  useGetLatestProposalIdByProposer,
  useGetProposalState,
  useGetProposals,
} from 'clients/api';
import { InfoIcon, Pagination, Spinner, TextButton } from 'components';
import CREATE_PROPOSAL_THRESHOLD_MANTISSA from 'constants/createProposalThresholdMantissa';
import { routes } from 'constants/routing';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useNavigate } from 'hooks/useNavigate';
import { UseUrlPaginationOutput } from 'hooks/useUrlPagination';
import { useTranslation } from 'packages/translations';
import { useAccountAddress } from 'packages/wallet';
import { Proposal } from 'types';

import TEST_IDS from '../testIds';
import CreateProposalModal from './CreateProposalModal';
import GovernanceProposal from './GovernanceProposal';
import { useStyles } from './styles';

interface ProposalListUiProps {
  proposals: Proposal[];
  isLoading: boolean;
  total: number | undefined;
  limit: number;
  setCurrentPage: (page: number) => void;
  createProposal: (payload: Omit<CreateProposalInput, 'accountAddress'>) => Promise<unknown>;
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
  const createProposalEnabled = useIsFeatureEnabled({ name: 'createProposal' });
  const { navigate } = useNavigate();
  const { newProposalStep } = useParams<{
    newProposalStep: 'create' | 'file' | 'manual' | undefined;
  }>();
  const [showCreateProposalModal, setShowCreateProposalModal] = useState(!!newProposalStep);
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <div css={styles.root}>
      <div css={[styles.header, styles.bottomSpace]}>
        <Typography variant="h4">{t('vote.proposals')}</Typography>

        {createProposalEnabled && (
          <div css={styles.createProposal} data-testid={TEST_IDS.createProposal}>
            <TextButton
              onClick={() => {
                setShowCreateProposalModal(true);
                navigate(routes.governanceProposalCreate.path);
              }}
              css={styles.marginLess}
              disabled={!canCreateProposal}
            >
              {t('vote.createProposalPlus')}
            </TextButton>

            <InfoIcon tooltip={t('vote.requiredVotingPower')} css={styles.infoIconWrapper} />
          </div>
        )}
      </div>

      {isLoading && <Spinner css={styles.loader} />}

      <div>
        {proposals.map(
          ({
            proposalId,
            description,
            state,
            endDate,
            cancelDate,
            queuedDate,
            etaDate,
            forVotesMantissa,
            abstainedVotesMantissa,
            againstVotesMantissa,
            executedDate,
            proposalType,
          }) => (
            <GovernanceProposal
              key={proposalId}
              css={styles.bottomSpace}
              proposalId={proposalId}
              proposalTitle={description.title}
              proposalState={state}
              endDate={endDate}
              executedDate={executedDate}
              cancelDate={cancelDate}
              queuedDate={queuedDate}
              etaDate={etaDate}
              forVotesMantissa={forVotesMantissa}
              againstVotesMantissa={againstVotesMantissa}
              abstainedVotesMantissa={abstainedVotesMantissa}
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

      {createProposalEnabled && showCreateProposalModal && (
        <CreateProposalModal
          isOpen={showCreateProposalModal}
          handleClose={() => {
            setShowCreateProposalModal(false);
            navigate(routes.governance.path);
          }}
          createProposal={createProposal}
          isCreateProposalLoading={isCreateProposalLoading}
        />
      )}
    </div>
  );
};

export type ProposalListPageProps = UseUrlPaginationOutput;

const ProposalList: React.FC<ProposalListPageProps> = ({ currentPage, setCurrentPage }) => {
  const { accountAddress } = useAccountAddress();

  const {
    data: { proposals, total, limit = 10 } = { proposals: [] },
    isFetching: isGetProposalsFetching,
    isPreviousData: isGetProposalsPreviousData,
  } = useGetProposals({
    page: currentPage,
    limit: 10,
    accountAddress,
  });

  const isFetchingProposals =
    isGetProposalsFetching && (isGetProposalsPreviousData || proposals.length === 0);

  const { mutateAsync: createProposal, isLoading: isCreateProposalLoading } = useCreateProposal();

  const { data: currentVotesData } = useGetCurrentVotes(
    { accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );

  const { data: latestProposalData } = useGetLatestProposalIdByProposer(
    { accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );

  const { data: latestProposalStateData } = useGetProposalState(
    { proposalId: latestProposalData?.proposalId || '' },
    { enabled: !!latestProposalData?.proposalId },
  );

  // User has enough voting weight to create proposal and doesn't currently have an active or pending proposal
  const canCreateProposal =
    currentVotesData?.votesMantissa.isGreaterThanOrEqualTo(CREATE_PROPOSAL_THRESHOLD_MANTISSA) &&
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
