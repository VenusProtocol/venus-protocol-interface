/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';
import { useGetVoterDetail } from 'clients/api';
import { VoteDetailTransaction } from 'types';
import Holding from './Holding';
import Transactions from './Transactions';
import History from './History';
import { useStyles } from './styles';

interface VoterDetailUiProps {
  balanceWei: BigNumber | undefined;
  delegateCount: number | undefined;
  votesWei: BigNumber | undefined;
  delegating: boolean;
  address: string;
  voterTransactions: VoteDetailTransaction[] | undefined;
}

export const VoterDetailUi: React.FC<VoterDetailUiProps> = ({
  balanceWei,
  delegateCount,
  votesWei,
  delegating,
  address,
  voterTransactions,
}) => {
  const styles = useStyles();
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
      <History />
    </div>
  );
};

const VoterDetail = () => {
  const { address } = useParams<{ address: string }>();
  const { data: voterDetail } = useGetVoterDetail({ address });
  return (
    <VoterDetailUi
      balanceWei={voterDetail?.balanceWei}
      delegateCount={voterDetail?.delegateCount}
      votesWei={voterDetail?.votesWei}
      delegating={!!voterDetail?.delegating}
      address={address}
      voterTransactions={voterDetail?.voterTransactions}
    />
  );
};

export default VoterDetail;
