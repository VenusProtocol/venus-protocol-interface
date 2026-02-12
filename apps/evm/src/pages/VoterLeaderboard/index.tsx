/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';

import { useGetVestingVaults, useGetVoterAccounts } from 'clients/api';
import { Page, Pagination } from 'components';
import { useUrlPagination } from 'hooks/useUrlPagination';
import type { VoterAccount } from 'types';

import LeaderboardTable from './LeaderboardTable';
import { useStyles } from './styles';

interface VoterLeaderboardProps {
  voterAccounts: VoterAccount[];
  offset: number;
  total: number | undefined;
  limit: number | undefined;
  isFetching: boolean;
  setCurrentPage: (page: number) => void;
}

export const VoterLeaderboardUi: React.FC<VoterLeaderboardProps> = ({
  voterAccounts,
  offset,
  total,
  limit,
  isFetching,
  setCurrentPage,
}) => {
  const styles = useStyles();

  return (
    <div css={styles.root} className="space-y-3">
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
  );
};

const VoterLeaderboard: React.FC = () => {
  const { currentPage, setCurrentPage } = useUrlPagination();

  const { data: vestingVaults } = useGetVestingVaults();

  const totalStakedXvs = vestingVaults
    .filter(v => v.stakedToken.symbol === 'XVS')
    .reduce((acc, v) => acc.plus(v.totalStakedMantissa), new BigNumber(0));

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
    <Page indexWithSearchEngines={false}>
      <VoterLeaderboardUi
        voterAccounts={voterAccounts}
        offset={offset}
        total={total}
        limit={limit}
        isFetching={isFetching}
        setCurrentPage={setCurrentPage}
      />
    </Page>
  );
};

export default VoterLeaderboard;
