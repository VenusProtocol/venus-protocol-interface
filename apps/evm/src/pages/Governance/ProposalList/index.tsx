import { type InputHTMLAttributes, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  useCreateProposal,
  useGetCurrentVotes,
  useGetLatestProposalIdByProposer,
  useGetProposalPreviews,
  useGetProposalState,
} from 'clients/api';
import {
  InfoIcon,
  Pagination,
  Select,
  type SelectOption,
  Spinner,
  TextButton,
  TextField,
} from 'components';
import CREATE_PROPOSAL_THRESHOLD_MANTISSA from 'constants/createProposalThresholdMantissa';
import { routes } from 'constants/routing';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useNavigate } from 'hooks/useNavigate';
import type { UseUrlPaginationOutput } from 'hooks/useUrlPagination';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { ProposalState } from 'types';
import { cn } from 'utilities';
import { getProposalStateLabel } from 'utilities/getProposalStateLabel';

import TEST_IDS from '../testIds';
import CreateProposalModal from './CreateProposalModal';
import GovernanceProposal from './GovernanceProposal';

const ALL_OPTION_VALUE = 'all';
const PROPOSALS_PER_PAGE = 10;

export interface ProposalListPageProps extends UseUrlPaginationOutput {
  className?: string;
}

const ProposalList: React.FC<ProposalListPageProps> = ({
  currentPage,
  setCurrentPage,
  className,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const isSearchFeatureEnabled = useIsFeatureEnabled({
    name: 'governanceSearch',
  });

  // Generate select options from proposal states
  const selectOptions = useMemo(() => {
    const allOption: SelectOption = {
      label: t('proposalList.selectOptions.all.label'),
      value: ALL_OPTION_VALUE,
    };

    const otherOptions: SelectOption[] = [];

    for (const s in ProposalState) {
      const state = +s;

      if (!Number.isNaN(state)) {
        otherOptions.push({
          label: getProposalStateLabel({ state: state as unknown as ProposalState }),
          value: state,
        });
      }
    }

    return [allOption, ...otherOptions];
  }, [t]);

  // TODO: integrate search with subgraph (see VEN-2477)
  const [selectedProposalState, setSelectedProposalState] = useState<
    ProposalState | typeof ALL_OPTION_VALUE
  >(ALL_OPTION_VALUE);
  const [searchValue, setSearchValue] = useState('');

  const {
    data: { proposalPreviews, total } = { proposalPreviews: [] },
    isFetching: isGetProposalsFetching,
    isPreviousData: isGetProposalsPreviousData,
  } = useGetProposalPreviews({
    page: currentPage,
    limit: PROPOSALS_PER_PAGE,
    accountAddress,
  });

  const isFetchingProposals =
    isGetProposalsFetching && (isGetProposalsPreviousData || proposalPreviews.length === 0);

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

  const createProposalEnabled = useIsFeatureEnabled({ name: 'createProposal' });
  const { navigate } = useNavigate();
  const { newProposalStep } = useParams<{
    newProposalStep: 'create' | 'file' | 'manual' | undefined;
  }>();
  const [showCreateProposalModal, setShowCreateProposalModal] = useState(!!newProposalStep);

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = changeEvent =>
    setSearchValue(changeEvent.currentTarget.value);

  // User has enough voting weight to create proposal and doesn't currently have an active or
  // pending proposal
  const canCreateProposal =
    currentVotesData?.votesMantissa.isGreaterThanOrEqualTo(CREATE_PROPOSAL_THRESHOLD_MANTISSA) &&
    latestProposalStateData?.state !== 0 &&
    latestProposalStateData?.state !== 1;

  return (
    <div className={cn(className, 'space-y-4 md:space-y-6')}>
      <div className="flex justify-between items-end">
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

      {isSearchFeatureEnabled && (
        <div className="space-y-4 sm:flex sm:gap-x-6 sm:space-y-0 sm:justify-between">
          <Select
            label={t('vote.proposalStateFilter.label')}
            variant="secondary"
            placeLabelToLeft
            options={selectOptions}
            className="min-w-[230px]"
            value={selectedProposalState}
            onChange={newValue =>
              setSelectedProposalState(newValue as ProposalState | typeof ALL_OPTION_VALUE)
            }
          />

          <TextField
            isSmall
            value={searchValue}
            onChange={handleSearchInputChange}
            placeholder={t('vote.searchInput.placeholder')}
            leftIconSrc="magnifier"
            variant="secondary"
            className="sm:max-w-[300px] w-full"
          />
        </div>
      )}

      {isFetchingProposals && <Spinner className="h-auto" />}

      <div className="space-y-4 md:space-y-6">
        {proposalPreviews.map(proposalPreview => (
          <GovernanceProposal key={proposalPreview.proposalId} {...proposalPreview} />
        ))}
      </div>

      {!!total && total > 0 && (
        <Pagination
          itemsCount={total}
          onChange={(nextIndex: number) => {
            setCurrentPage(nextIndex);
          }}
          itemsPerPageCount={PROPOSALS_PER_PAGE}
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
