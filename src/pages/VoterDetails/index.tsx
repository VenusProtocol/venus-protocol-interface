/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { EllipseAddress, Icon } from 'components';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'translation';
import { VoteDetailTransaction, VoterHistory } from 'types';

import { useGetVoterDetails, useGetVoterHistory } from 'clients/api';
import { routes } from 'constants/routing';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import useUpdateBreadcrumbNavigation from 'hooks/useUpdateBreadcrumbNavigation';

import History from './History';
import Holding from './Holding';
import Transactions from './Transactions';
import { useStyles } from './styles';

interface VoterDetailsUiProps {
  balanceWei: BigNumber | undefined;
  delegateCount: number | undefined;
  votesWei: BigNumber | undefined;
  delegating: boolean;
  address: string;
  voterTransactions: VoteDetailTransaction[] | undefined;
  voterHistory: VoterHistory[] | undefined;
  setCurrentHistoryPage: (page: number) => void;
  total: number;
  limit: number;
  isHistoryFetching: boolean;
}

export const VoterDetailsUi: React.FC<VoterDetailsUiProps> = ({
  balanceWei,
  delegateCount,
  votesWei,
  delegating,
  address,
  voterTransactions,
  voterHistory,
  setCurrentHistoryPage,
  total,
  limit,
  isHistoryFetching,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const copyToClipboard = useCopyToClipboard(t('interactive.copy.walletAddress'));

  useUpdateBreadcrumbNavigation(
    currentPathNodes =>
      currentPathNodes.concat([
        {
          href: routes.governanceLeaderBoard.path,
          dom: t('voterLeaderboard.title'),
        },
        {
          dom: (
            <div css={styles.breadcrumbNavigationAddress}>
              <Typography variant="h3" color="textPrimary">
                <EllipseAddress address={address} />
              </Typography>

              <Icon
                name="copy"
                css={styles.breadcrumbNavigationCopyIcon}
                onClick={() => copyToClipboard(address)}
              />
            </div>
          ),
        },
      ]),
    [],
  );

  return (
    <div css={styles.root}>
      <div css={styles.top}>
        <Holding
          css={styles.topRowLeft}
          balanceWei={balanceWei}
          delegateCount={delegateCount}
          votesWei={votesWei}
          delegating={delegating}
        />

        <Transactions
          css={styles.topRowRight}
          address={address}
          voterTransactions={voterTransactions}
        />
      </div>

      <History
        total={total}
        voterHistory={voterHistory}
        setCurrentPage={setCurrentHistoryPage}
        limit={limit}
        isFetching={isHistoryFetching}
      />
    </div>
  );
};

const VoterDetails = () => {
  const [currentHistoryPage, setCurrentHistoryPage] = useState(0);
  const { address } = useParams<{ address: string }>();
  const { data: voterDetails } = useGetVoterDetails({ address });
  const {
    data: { voterHistory, total, limit } = { voterHistory: [], total: 0, limit: 16 },
    isFetching,
  } = useGetVoterHistory({ address, page: currentHistoryPage });

  return (
    <VoterDetailsUi
      balanceWei={voterDetails?.balanceWei}
      delegateCount={voterDetails?.delegateCount}
      voterHistory={voterHistory}
      votesWei={voterDetails?.votesWei}
      delegating={!!voterDetails?.delegating}
      address={address}
      voterTransactions={voterDetails?.voterTransactions}
      setCurrentHistoryPage={setCurrentHistoryPage}
      total={total}
      limit={limit}
      isHistoryFetching={isFetching}
    />
  );
};

export default VoterDetails;
