/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import _cloneDeep from 'lodash/cloneDeep';
import { useMemo } from 'react';

import { Table, type TableColumn, Username } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import type { VoterAccount } from 'types';
import { convertMantissaToTokens, formatPercentageToReadableValue } from 'utilities';

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
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const columns: TableColumn<VoterAccount>[] = useMemo(
    () => [
      {
        key: 'rank',
        label: t('voterLeaderboard.columns.rank'),
        selectOptionLabel: t('voterLeaderboard.columns.rank'),
        renderCell: (voter, rowIndex) => (
          <Typography css={styles.inline} color="textPrimary" variant="small2" component="div">
            {rowIndex + 1 + offset}
            <Username address={voter.address} ellipseBreakpoint="lg">
              {({ innerContent }) => (
                <Link
                  to={routes.governanceVoter.path.replace(':address', voter.address)}
                  css={styles.address}
                >
                  {innerContent}
                </Link>
              )}
            </Username>
          </Typography>
        ),
      },
      {
        key: 'votes',
        label: t('voterLeaderboard.columns.votes'),
        selectOptionLabel: t('voterLeaderboard.columns.votes'),
        align: 'right',
        renderCell: voter => (
          <Typography color="textPrimary" variant="small2">
            {convertMantissaToTokens({
              value: voter.votesMantissa,
              token: xvs,
              returnInReadableFormat: true,
              addSymbol: false,
            })}
          </Typography>
        ),
      },
      {
        key: 'voteWeight',
        label: t('voterLeaderboard.columns.voteWeight'),
        selectOptionLabel: t('voterLeaderboard.columns.voteWeight'),
        align: 'right',
        renderCell: voter => (
          <Typography color="textPrimary" variant="small2">
            {formatPercentageToReadableValue(voter.voteWeightPercent)}
          </Typography>
        ),
      },
      {
        key: 'proposalsVoted',
        label: t('voterLeaderboard.columns.proposalsVoted'),
        selectOptionLabel: t('voterLeaderboard.columns.proposalsVoted'),
        align: 'right',
        renderCell: voter => (
          <Typography color="textPrimary" variant="small2">
            {voter.proposalsVoted}
          </Typography>
        ),
      },
    ],
    [offset, xvs, t, styles.address, styles.inline],
  );

  const cardColumns = useMemo(() => {
    const newColumns = _cloneDeep(columns);
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
      rowKeyExtractor={row => `voter-leaderboard-table-row-${row.address}`}
      breakpoint="xl"
      css={styles.cardContentGrid}
    />
  );
};

export default LeaderboardTable;
