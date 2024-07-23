/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { useMemo } from 'react';

import { EllipseAddress, Table, type TableColumn } from 'components';
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
        accessorFn: (_row, index) => index + 1 + offset,
        header: t('voterLeaderboard.columns.rank'),
        cell: ({ row }) => (
          <Typography css={styles.inline} color="textPrimary" variant="small2" component="div">
            {row.index + 1 + offset}
            <Link
              to={routes.governanceVoter.path.replace(':address', row.original.address)}
              css={styles.address}
            >
              <EllipseAddress address={row.original.address} ellipseBreakpoint="lg" />
            </Link>
          </Typography>
        ),
      },
      {
        accessorFn: row => row.votesMantissa.toNumber(),
        header: t('voterLeaderboard.columns.votes'),
        cell: ({ row }) => (
          <Typography color="textPrimary" variant="small2">
            {convertMantissaToTokens({
              value: row.original.votesMantissa,
              token: xvs,
              returnInReadableFormat: true,
              addSymbol: false,
            })}
          </Typography>
        ),
      },
      {
        accessorFn: row => +row.voteWeightPercent,
        header: t('voterLeaderboard.columns.voteWeight'),
        cell: ({ row }) => (
          <Typography color="textPrimary" variant="small2">
            {formatPercentageToReadableValue(row.original.voteWeightPercent)}
          </Typography>
        ),
      },
      {
        accessorKey: 'proposalsVoted',
        header: t('voterLeaderboard.columns.proposalsVoted'),
        cell: ({ row }) => (
          <Typography color="textPrimary" variant="small2">
            {row.original.proposalsVoted}
          </Typography>
        ),
      },
    ],
    [offset, xvs, t, styles.address, styles.inline],
  );

  return (
    <Table
      title={t('voterLeaderboard.addressesByVotingWeight')}
      columns={columns}
      data={voterAccounts}
      isFetching={isFetching}
      initialState={{
        sorting: [
          {
            id: 'rank',
            desc: false,
          },
        ],
      }}
    />
  );
};

export default LeaderboardTable;
