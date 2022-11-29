/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { EllipseAddress, Table, TableColumn } from 'components';
import { cloneDeep } from 'lodash';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'translation';
import { VoterAccount } from 'types';
import { convertWeiToTokens, formatToReadablePercentage } from 'utilities';

import { routes } from 'constants/routing';
import { TOKENS } from 'constants/tokens';

import { useStyles } from './styles';

export interface LeaderboardTableProps {
  voterAccounts: VoterAccount[];
  offset: number;
  isFetching: boolean;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  voterAccounts,
  offset,
  isFetching,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const columns: TableColumn<VoterAccount>[] = useMemo(
    () => [
      {
        key: 'rank',
        label: t('voterLeaderboard.columns.rank'),
        renderCell: (voter, rowIndex) => (
          <Typography css={styles.inline} color="textPrimary" variant="small2">
            {rowIndex + 1 + offset}
            <Link
              to={routes.governanceVoter.path.replace(':address', voter.address)}
              css={styles.address}
            >
              <EllipseAddress address={voter.address} ellipseBreakpoint="lg" />
            </Link>
          </Typography>
        ),
      },
      {
        key: 'votes',
        label: t('voterLeaderboard.columns.votes'),
        align: 'right',
        renderCell: voter => (
          <Typography color="textPrimary" variant="small2">
            {convertWeiToTokens({
              valueWei: voter.votesWei,
              token: TOKENS.xvs,
              returnInReadableFormat: true,
              addSymbol: false,
              minimizeDecimals: true,
            })}
          </Typography>
        ),
      },
      {
        key: 'voteWeight',
        label: t('voterLeaderboard.columns.voteWeight'),
        align: 'right',
        renderCell: voter => (
          <Typography color="textPrimary" variant="small2">
            {formatToReadablePercentage(voter.voteWeightPercent)}
          </Typography>
        ),
      },
      {
        key: 'proposalsVoted',
        label: t('voterLeaderboard.columns.proposalsVoted'),
        align: 'right',
        renderCell: voter => (
          <Typography color="textPrimary" variant="small2">
            {voter.proposalsVoted}
          </Typography>
        ),
      },
    ],
    [],
  );

  const cardColumns = useMemo(() => {
    const newColumns = cloneDeep(columns);
    newColumns[2].align = 'center';
    newColumns[3].align = 'left';
    return newColumns;
  }, [columns]);

  return (
    <Table
      title={t('voterLeaderboard.addressesByVotingWeight')}
      columns={columns}
      cardColumns={cardColumns}
      data={voterAccounts}
      isFetching={isFetching}
      initialOrder={{
        orderBy: columns[0],
        orderDirection: 'asc',
      }}
      rowKeyExtractor={row => `voter-leaderboard-table-row-${row.id}`}
      breakpoint="xl"
      css={styles.cardContentGrid}
    />
  );
};

export default LeaderboardTable;
