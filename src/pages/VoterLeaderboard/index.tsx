/** @jsxImportSource @emotion/react */
import { Pagination } from 'components';
import React, { useState } from 'react';
import { VoterAccount } from 'types';

import { useGetVoterAccounts } from 'clients/api';

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
            window.scrollTo(0, 0);
          }}
          itemsPerPageCount={limit}
        />
      )}
    </div>
  );
};

const VoterLeaderboard = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const {
    data: { voterAccounts, offset, total, limit } = {
      voterAccounts: [],
      offset: 0,
      total: undefined,
      limit: undefined,
    },
    isFetching,
  } = useGetVoterAccounts({ page: currentPage });

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
