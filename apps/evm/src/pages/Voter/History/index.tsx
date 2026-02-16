/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';

import { Pagination, Spinner } from 'components';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import type { VoterHistory } from 'types';

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

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return (
    <div className={className}>
      <Typography variant="h4">{t('voterDetail.votingHistory')}</Typography>
      {isFetching && <Spinner />}
      {voterHistory.map(
        ({
          proposalId,
          description,
          state,
          endDate,
          forVotesMantissa,
          abstainedVotesMantissa,
          againstVotesMantissa,
          createdDate,
          queuedDate,
          cancelDate,
          executedDate,
          support,
        }) => (
          <VoterProposal
            xvs={xvs}
            key={proposalId}
            proposalNumber={proposalId}
            proposalTitle={description.title}
            proposalState={state}
            forVotesMantissa={forVotesMantissa}
            againstVotesMantissa={againstVotesMantissa}
            abstainedVotesMantissa={abstainedVotesMantissa}
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
          }}
          itemsPerPageCount={limit}
        />
      ) : null}
    </div>
  );
};

export default History;
