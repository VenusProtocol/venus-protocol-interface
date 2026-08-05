import BigNumber from 'bignumber.js';

import { useGetVestingVaults, useGetVoterAccounts } from 'clients/api';
import { Page, Pagination } from 'components';
import { useUrlPagination } from 'hooks/useUrlPagination';
import LeaderboardTable from './LeaderboardTable';

const VoterLeaderboard: React.FC = () => {
  const { currentPage, setCurrentPage } = useUrlPagination();

  const { data: vestingVaults } = useGetVestingVaults();

  const totalStakedXvs = vestingVaults
    .filter(v => v.stakedToken.symbol === 'XVS')
    .reduce((acc, v) => acc.plus(v.stakeBalanceMantissa), new BigNumber(0));

  const {
    data: { voterAccounts, offset, total, limit } = {
      voterAccounts: [],
      offset: 0,
      total: undefined,
      limit: undefined,
    },
    isFetching: isGetVoterAccountsFetching,
    isPlaceholderData: isGetVoterAccountsPreviousData,
  } = useGetVoterAccounts({ page: currentPage, totalStakedXvs });

  const isFetching =
    isGetVoterAccountsFetching && (isGetVoterAccountsPreviousData || voterAccounts.length === 0);

  return (
    <Page>
      <div className="flex flex-col">
        <LeaderboardTable voterAccounts={voterAccounts} offset={offset} isFetching={isFetching} />

        {total && (
          <Pagination
            itemsCount={total}
            onChange={(nextIndex: number) => {
              setCurrentPage(nextIndex);
            }}
            itemsPerPageCount={limit}
          />
        )}
      </div>
    </Page>
  );
};

export default VoterLeaderboard;
