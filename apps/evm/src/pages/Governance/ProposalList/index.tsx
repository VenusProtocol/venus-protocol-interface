import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

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
import useDebounceValue from 'hooks/useDebounceValue';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useNavigate } from 'hooks/useNavigate';
import { PAGE_PARAM_DEFAULT_VALUE, PAGE_PARAM_KEY } from 'hooks/useUrlPagination';
import type { UseUrlPaginationOutput } from 'hooks/useUrlPagination';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { ProposalState } from 'types';
import { cn } from 'utilities';
import { getProposalStateLabel } from 'utilities/getProposalStateLabel';

import TEST_IDS from '../testIds';
import CreateProposalModal from './CreateProposalModal';
import GovernanceProposal from './GovernanceProposal';

const PROPOSAL_STATE_PARAM_KEY = 'proposalState';
const SEARCH_PARAM_KEY = 'search';
const PROPOSAL_STATE_ALL_OPTION_VALUE = 'all';
const PROPOSALS_PER_PAGE = 10;

interface Filtering {
  [PROPOSAL_STATE_PARAM_KEY]: ProposalState | typeof PROPOSAL_STATE_ALL_OPTION_VALUE;
  [SEARCH_PARAM_KEY]?: string;
}

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
    const allOption: SelectOption<Filtering[typeof PROPOSAL_STATE_PARAM_KEY]> = {
      label: t('proposalList.selectOptions.all.label'),
      value: PROPOSAL_STATE_ALL_OPTION_VALUE,
    };

    const otherOptions: SelectOption<Filtering[typeof PROPOSAL_STATE_PARAM_KEY]>[] = [];

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

  // Sync proposal filters with search params
  const [searchParams, setSearchParams] = useSearchParams();

  const { proposalState: selectedProposalState, search: searchValue } = useMemo<Filtering>(
    () => ({
      [PROPOSAL_STATE_PARAM_KEY]: !searchParams.get(PROPOSAL_STATE_PARAM_KEY)
        ? PROPOSAL_STATE_ALL_OPTION_VALUE
        : +searchParams.get(PROPOSAL_STATE_PARAM_KEY)!,
      [SEARCH_PARAM_KEY]: searchParams.get(SEARCH_PARAM_KEY) ?? undefined,
    }),
    [searchParams],
  );

  const updateFilters = (newFiltering: Partial<Filtering>) =>
    setSearchParams(currentSearchParams => {
      const params = {
        ...Object.fromEntries(currentSearchParams),
        ...newFiltering,
        [PAGE_PARAM_KEY]: PAGE_PARAM_DEFAULT_VALUE, // Reset page param
      };

      const result: Record<string, string> = {};

      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];

        if (
          // Filter out undefined and empty string values
          value !== undefined &&
          value !== '' &&
          // Remove proposal state param if its value is the "all" option
          (key !== PROPOSAL_STATE_PARAM_KEY || value !== PROPOSAL_STATE_ALL_OPTION_VALUE)
        ) {
          // Convert the value to a string and assign it to the result object
          result[key as keyof typeof params] = String(value);
        }
      });

      return result;
    });

  const debouncedSearchValue = useDebounceValue(searchValue);

  const {
    data: { proposalPreviews, total } = { proposalPreviews: [] },
    isFetching: isGetProposalsFetching,
    isPreviousData: isGetProposalsPreviousData,
  } = useGetProposalPreviews({
    limit: PROPOSALS_PER_PAGE,
    accountAddress,
    page: currentPage,
    proposalState:
      selectedProposalState === PROPOSAL_STATE_ALL_OPTION_VALUE ? undefined : selectedProposalState,
    search: debouncedSearchValue,
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
            testId={TEST_IDS.proposalStateSelect}
            value={selectedProposalState}
            onChange={newValue =>
              updateFilters({
                proposalState: newValue as Filtering['proposalState'],
              })
            }
          />

          <TextField
            isSmall
            value={searchValue}
            onChange={event =>
              updateFilters({
                search: event.currentTarget.value,
              })
            }
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
