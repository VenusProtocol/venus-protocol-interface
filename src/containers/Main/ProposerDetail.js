/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import ProposerInfo from 'components/Vote/ProposerDetail/ProposerInfo';
import Holding from 'components/Vote/ProposerDetail/Holding';
import Transactions from 'components/Vote/ProposerDetail/Transactions';
import VotingHistory from 'components/Vote/ProposerDetail/VotingHistory';
import MainLayout from 'containers/Layout/MainLayout';
import { promisify } from 'utilities';
import { Row, Column } from 'components/Basic/Style';

const ProposerDetailWrapper = styled.div`
  width: 100%;

  .header-section {
    margin-bottom: 40px;

    .column-1 {
      flex: 1;
      margin-right: 19px;

      .proposer-info {
        height: 102px;
        margin-bottom: 39px;
      }

      .holding {
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

  .middle-section {
    width: 100%;
    height: 406px;
    margin-bottom: 39px;

    .holding {
      width: 40%;
    }
  }

  .voting-history {
    width: 100%;
  }
`;

function ProposerDetail({ match, getVoterDetail, getVoterHistory }) {
  const [holdingInfo, setHoldingInfo] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [data, setData] = useState({});
  const [current, setCurrent] = useState(1);

  const loadVoterDetail = async () => {
    await promisify(getVoterDetail, { address: match.params.address })
      .then(res => {
        if (res.data) {
          setHoldingInfo({
            balance: new BigNumber(res.data.balance)
              .div(new BigNumber(10).pow(18))
              .dp(4, 1)
              .toString(10),
            delegates: res.data.delegates.toLowerCase(),
            delegateCount: res.data.delegateCount || 0,
            votes: new BigNumber(res.data.votes)
              .div(new BigNumber(10).pow(18))
              .dp(4, 1)
              .toString(10)
          });
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
        setData(res.data);
      })
      .catch(() => {});
  };

  const handleChangePage = (pageNumber, offset, limit) => {
    setCurrent(pageNumber);
    promisify(getVoterHistory, {
      address: match.params.address,
      offset,
      limit
    })
      .then(res => {
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
    <MainLayout title="Details">
      <ProposerDetailWrapper className="flex flex-column">
        <Row>
          <Column xs="12" sm="5">
            <ProposerInfo address={match.params ? match.params.address : ''} />
          </Column>
        </Row>
        <Row>
          <Column xs="12" sm="5">
            <Holding
              address={match.params ? match.params.address : ''}
              holdingInfo={holdingInfo}
            />
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
              data={data.result}
              pageNumber={current}
              total={data.total || 0}
              onChangePage={handleChangePage}
            />
          </Column>
        </Row>
      </ProposerDetailWrapper>
    </MainLayout>
  );
}

ProposerDetail.propTypes = {
  match: PropTypes.object,
  getVoterDetail: PropTypes.func.isRequired,
  getVoterHistory: PropTypes.func.isRequired
};

ProposerDetail.defaultProps = {
  match: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { getVoterDetail, getVoterHistory } = accountActionCreators;

  return bindActionCreators(
    {
      getVoterDetail,
      getVoterHistory
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(ProposerDetail);
