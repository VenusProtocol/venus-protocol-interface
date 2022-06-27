/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';
import { useGetVoterDetail } from 'clients/api';
import Holding from './Holding';
import Transactions from './Transactions';
import History from './History';
import { useStyles } from './styles';

interface VoterDetailUiProps {
  balanceWei: BigNumber | undefined;
  delegateCount: number | undefined;
  votesWei: BigNumber | undefined;
  delegating: boolean;
}

export const VoterDetailUi: React.FC<VoterDetailUiProps> = ({
  balanceWei,
  delegateCount,
  votesWei,
  delegating,
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
        <Transactions css={styles.topRowRight} />
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
    />
  );
};

export default VoterDetail;
