/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connectAccount } from 'core';
import ProposerInfo from 'components/Vote/ProposerDetail/ProposerInfo';
import Holding from 'components/Vote/ProposerDetail/Holding';
import Transactions from 'components/Vote/ProposerDetail/Transactions';
import VotingHistory from 'components/Vote/ProposerDetail/VotingHistory';
import { promisify } from 'utilities';
import { Row, Column } from 'components/Basic/Style';
import { State } from 'core/modules/initialState';

const ProposerDetailWrapper = styled.div`
  width: 100%;

  .middle-section {
    width: 100%;
    height: 406px;
    margin-bottom: 39px;

    .holding {
      width: 40%;
    }
  }

  .header-section {
    margin-bottom: 40px;

    .column-1 {
      flex: 1;
      margin-right: 19px;

      .proposer-info {
        height: 102px;
        margin-bottom: 39px;
      }
    }

    .column-2 {
      flex: 1.5;
      margin-left: 19px;

      .transactions {
        margin-top: 141px;
      }
    }
  }

  .voting-history {
    width: 100%;
  }
`;

interface Props extends RouteComponentProps<{ address: string }> {
  getVoterDetail: $TSFixMe;
  getVoterHistory: $TSFixMe;
}

function ProposerDetail({ match, getVoterDetail, getVoterHistory }: Props) {
  const [holdingInfo, setHoldingInfo] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [data, setData] = useState({});
  const [current, setCurrent] = useState(1);

  const loadVoterDetail = async () => {
    await promisify(getVoterDetail, { address: match.params.address })
      .then(res => {
        // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
        if (res.data) {
          setHoldingInfo({
            // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
            balance: new BigNumber(res.data.balance)
              .div(new BigNumber(10).pow(18))
              .dp(4, 1)
              .toString(10),
            // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
            delegates: res.data.delegates.toLowerCase(),
            // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
            delegateCount: res.data.delegateCount || 0,
            // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
            votes: new BigNumber(res.data.votes)
              .div(new BigNumber(10).pow(18))
              .dp(4, 1)
              .toString(10),
          });
          // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
          setTransactions(res.data.txs);
        }
      })
      .catch(() => {
        setHoldingInfo({});
      });
  };

  const loadVoterHistory = async () => {
    await promisify(getVoterHistory, { address: match.params.address })
      .then(res => {
        // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
        setData(res.data);
      })
      .catch(() => {});
  };

  const handleChangePage = (
    pageNumber: $TSFixMe,

    offset: $TSFixMe,

    limit: $TSFixMe,
  ) => {
    setCurrent(pageNumber);
    promisify(getVoterHistory, {
      address: match.params.address,
      offset,
      limit,
    })
      .then(res => {
        // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
        setData(res.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (match.params && match.params.address) {
      loadVoterDetail();
      loadVoterHistory();
    }
  }, [match]);

  return (
    <ProposerDetailWrapper className="flex flex-column">
      <Row>
        <Column xs="12" sm="5">
          <ProposerInfo address={match.params ? match.params.address : ''} />
        </Column>
      </Row>
      <Row>
        <Column xs="12" sm="5">
          <Holding address={match.params ? match.params.address : ''} holdingInfo={holdingInfo} />
        </Column>
        <Column xs="12" sm="7">
          <Transactions
            address={match.params ? match.params.address : ''}
            transactions={transactions}
          />
        </Column>
      </Row>
      <Row>
        <Column xs="12" sm="12">
          <VotingHistory
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'result' does not exist on type '{}'.
            data={data.result}
            pageNumber={current}
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'total' does not exist on type '{}'.
            total={data.total || 0}
            onChangePage={handleChangePage}
          />
        </Column>
      </Row>
    </ProposerDetailWrapper>
  );
}

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connectAccount(mapStateToProps)(withRouter(ProposerDetail));
