/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Pagination, Spinner } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { VoterHistory } from 'types';

import VoterProposal from './VoterProposal';
import { useStyles } from './styles';

interface HistoryProps {
  className?: string;
  voterHistory: VoterHistory[] | undefined;
  setCurrentPage: (page: number) => void;
  total: number;
  limit: number;
  isFetching: boolean;
}

export const History: React.FC<HistoryProps> = ({
  className,
  voterHistory = [],
  setCurrentPage,
  total,
  limit,
  isFetching,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <div className={className}>
      <Typography variant="h4">{t('voterDetail.votingHistory')}</Typography>
      {isFetching && <Spinner />}
      {voterHistory.map(
        ({
          proposal: {
            id,
            description,
            state,
            endDate,
            forVotesWei,
            abstainedVotesWei,
            againstVotesWei,
            createdDate,
            queuedDate,
            cancelDate,
            executedDate,
          },
          support,
        }) => (
          <VoterProposal
            key={id}
            proposalNumber={id}
            proposalTitle={description.title}
            proposalState={state}
            forVotesWei={forVotesWei}
            againstVotesWei={againstVotesWei}
            abstainedVotesWei={abstainedVotesWei}
            userVoteStatus={support}
            createdDate={createdDate}
            queuedDate={queuedDate}
            cancelDate={cancelDate}
            executedDate={executedDate}
            endDate={endDate}
          />
        ),
      )}
      {total ? (
        <Pagination
          css={styles.pagination}
          itemsCount={total}
          onChange={(nextIndex: number) => {
            setCurrentPage(nextIndex);
            window.scrollTo(0, 0);
          }}
          itemsPerPageCount={limit}
        />
      ) : null}
    </div>
  );
};

export default History;
