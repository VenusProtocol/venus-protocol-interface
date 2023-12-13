/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';

import { useGetVestingVaults, useGetVoterAccounts } from 'clients/api';
import { Pagination } from 'components';
import { useUrlPagination } from 'hooks/useUrlPagination';
import { VoterAccount } from 'types';

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
    <div css={styles.root}>
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

  const { data: vestingVaults } = useGetVestingVaults({ accountAddress: '' });

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
    isPreviousData: isGetVoterAccountsPreviousData,
  } = useGetVoterAccounts({ page: currentPage, totalStakedXvs });

  const isFetching =
    isGetVoterAccountsFetching && (isGetVoterAccountsPreviousData || voterAccounts.length === 0);

  return (
    <VoterLeaderboardUi
      voterAccounts={voterAccounts}
      offset={offset}
      total={total}
      limit={limit}
      isFetching={isFetching}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default VoterLeaderboard;
