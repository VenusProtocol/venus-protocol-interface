import { cloneDeep } from 'lodash-es';
import { useMemo } from 'react';

import { Table, type TableColumn, Username } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import type { VoterAccount } from 'types';
import { convertMantissaToTokens, formatPercentageToReadableValue } from 'utilities';

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
          <div className="flex text-b1r text-white">
            {rowIndex + 1 + offset}
            <Username address={voter.address}>
              {({ innerContent }) => (
                <Link
                  to={routes.governanceVoter.path.replace(':address', voter.address)}
                  className="overflow-hidden text-ellipsis pl-8 hover:text-mediumBlue"
                >
                  {innerContent}
                </Link>
              )}
            </Username>
          </div>
        ),
      },
      {
        key: 'votes',
        label: t('voterLeaderboard.columns.votes'),
        selectOptionLabel: t('voterLeaderboard.columns.votes'),
        align: 'right',
        renderCell: voter => (
          <span className="text-b1r text-white">
            {convertMantissaToTokens({
              value: voter.votesMantissa,
              token: xvs,
              returnInReadableFormat: true,
              addSymbol: false,
            })}
          </span>
        ),
      },
      {
        key: 'voteWeight',
        label: t('voterLeaderboard.columns.voteWeight'),
        selectOptionLabel: t('voterLeaderboard.columns.voteWeight'),
        align: 'right',
        renderCell: voter => (
          <span className="text-b1r text-white">
            {formatPercentageToReadableValue(voter.voteWeightPercent)}
          </span>
        ),
      },
      {
        key: 'proposalsVoted',
        label: t('voterLeaderboard.columns.proposalsVoted'),
        selectOptionLabel: t('voterLeaderboard.columns.proposalsVoted'),
        align: 'right',
        renderCell: voter => <span className="text-b1r text-white">{voter.proposalsVoted}</span>,
      },
    ],
    [offset, xvs, t],
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
      rowKeyExtractor={row => `voter-leaderboard-table-row-${row.address}`}
      breakpoint="xl"
    />
  );
};

export default LeaderboardTable;
