/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { Typography } from '@mui/material';
import { EllipseText, Table, TableProps } from 'components';
import Path from 'constants/path';
import { useTranslation } from 'translation';
import { VoterAccount } from 'types';
import { convertWeiToTokens, formatToReadablePercentage } from 'utilities';
import { useStyles } from './styles';

export interface ILeaderboardTableProps extends Pick<TableProps, 'getRowHref'> {
  voterAccounts: VoterAccount[];
  offset: number;
  isFetching: boolean;
}

export const LeaderboardTable: React.FC<ILeaderboardTableProps> = ({
  voterAccounts,
  offset,
  isFetching,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const columns = useMemo(
    () => [
      { key: 'rank', label: t('voterLeaderboard.columns.rank'), orderable: false, align: 'left' },
      {
        key: 'votes',
        label: t('voterLeaderboard.columns.votes'),
        orderable: false,
        align: 'right',
      },
      {
        key: 'voteWeight',
        label: t('voterLeaderboard.columns.voteWeight'),
        orderable: false,
        align: 'right',
      },
      {
        key: 'proposalsVoted',
        label: t('voterLeaderboard.columns.proposalsVoted'),
        orderable: false,
        align: 'right',
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

  // Format voters to rows
  const rows: TableProps['data'] = useMemo(
    () =>
      voterAccounts.map((voter, idx) => [
        {
          key: 'rank',
          render: () => (
            <Typography css={styles.inline} color="textPrimary" variant="small2">
              {idx + 1 + offset}
              <EllipseText css={styles.address} minChars={6} text={voter.address}>
                <Link
                  className="ellipse-text"
                  to={Path.VOTE_ADDRESS.replace(':address', voter.address)}
                />
              </EllipseText>
            </Typography>
          ),
          value: idx + 1 + offset,
        },
        {
          key: 'votes',
          render: () => (
            <Typography color="textPrimary" variant="small2">
              {convertWeiToTokens({
                valueWei: voter.votesWei,
                tokenId: 'xvs',
                returnInReadableFormat: true,
                addSymbol: false,
                minimizeDecimals: true,
              })}
            </Typography>
          ),
          align: 'right',
          value: voter.votesWei.toFixed(),
        },
        {
          key: 'voteWeight',
          render: () => (
            <Typography color="textPrimary" variant="small2">
              {formatToReadablePercentage(voter.voteWeightPercent)}
            </Typography>
          ),
          value: voter.voteWeightPercent,
          align: 'right',
        },
        {
          key: 'proposalsVoted',
          render: () => (
            <Typography color="textPrimary" variant="small2">
              {voter.proposalsVoted}
            </Typography>
          ),
          value: voter.proposalsVoted,
          align: 'right',
        },
      ]),
    [JSON.stringify(voterAccounts)],
  );

  return (
    <Table
      title={t('voterLeaderboard.addressesByVotingWeight')}
      columns={columns}
      cardColumns={cardColumns}
      data={rows}
      isFetching={isFetching}
      initialOrder={{
        orderBy: 'rank',
        orderDirection: 'asc',
      }}
      rowKeyIndex={0}
      tableCss={styles.table}
      cardsCss={styles.cards}
      css={styles.cardContentGrid}
    />
  );
};

export default LeaderboardTable;
