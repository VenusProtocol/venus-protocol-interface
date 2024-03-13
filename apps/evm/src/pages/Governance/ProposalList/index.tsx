import { useState } from 'react';
import { useParams } from 'react-router-dom';

import {
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
import type { UseUrlPaginationOutput } from 'hooks/useUrlPagination';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';

import TEST_IDS from '../testIds';
import CreateProposalModal from './CreateProposalModal';
import GovernanceProposal from './GovernanceProposal';

export interface ProposalListPageProps extends UseUrlPaginationOutput {
  className?: string;
}

const ProposalList: React.FC<ProposalListPageProps> = ({
  currentPage,
  setCurrentPage,
  className,
}) => {
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

  const createProposalEnabled = useIsFeatureEnabled({ name: 'createProposal' });
  const { navigate } = useNavigate();
  const { newProposalStep } = useParams<{
    newProposalStep: 'create' | 'file' | 'manual' | undefined;
  }>();
  const [showCreateProposalModal, setShowCreateProposalModal] = useState(!!newProposalStep);
  const { t } = useTranslation();

  return (
    <div className={className}>
      <div className="mb-6 flex justify-between items-end">
        <h4 className="text-lg">{t('vote.proposals')}</h4>

        {createProposalEnabled && (
          <div className="flex items-center" data-testid={TEST_IDS.createProposal}>
            <TextButton
              onClick={() => {
                setShowCreateProposalModal(true);
                navigate(routes.governanceProposalCreate.path);
              }}
              className="p-0 h-7 mr-2"
              disabled={!canCreateProposal}
            >
              {t('vote.createProposalPlus')}
            </TextButton>

            <InfoIcon tooltip={t('vote.requiredVotingPower')} />
          </div>
        )}
      </div>

      {isFetchingProposals && <Spinner className="h-auto mb-6" />}

      <div className="space-y-6">
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
          itemsCount={total}
          onChange={(nextIndex: number) => {
            setCurrentPage(nextIndex);
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

export default ProposalList;
