import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import commaNumber from 'comma-number';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import { connectAccount, accountActionCreators } from 'core';
import MainLayout from 'containers/Layout/MainLayout';
import { promisify } from 'utilities';

const LeaderboardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TableWrapper = styled.div`
  position: relative;
  width: 100%;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-bg-primary);
  box-sizing: content-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  margin: 20px 0;
  max-width: 1200px;

  .header-title {
    padding: 20px;
    font-weight: 600;
    font-size: 20px;
    color: var(--color-white);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .table_header {
    padding: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    > div {
      color: var(--color-white);
      font-weight: bold;
    }
    @media (max-width: 992px) {
      .proposals,
      .votes,
      .vote-weight {
        display: none;
      }
    }
  }
  .table_content {
    .empty-voter {
      font-size: 24px;
      color: var(--color-white);
      padding: 20px 0;
    }
    .table_item {
      padding: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      &:hover {
        background-color: var(--color-bg-active);
        border-left: 2px solid var(--color-orange);
      }
      div {
        color: var(--color-white);
        max-width: 100%;
      }
      .mobile-label {
        display: none;
        @media (max-width: 992px) {
          font-weight: bold;
          display: block;
        }
      }
      .rank {
        .rank-number {
          width: 40px;
          min-width: 40px;
          font-weight: bold;
        }
        .highlight {
          word-break: break-all;
          white-space: break-spaces;
        }
      }
    }
  }
`;

const format = commaNumber.bindWith(',', '.');

function VoterLeaderboard({ history, getVoterAccounts }) {
  const [voterAccounts, setVoterAccounts] = useState([]);

  useEffect(() => {
    promisify(getVoterAccounts, { limit: 100, offset: 0 })
      .then(res => {
        setVoterAccounts(res.data.result || []);
      })
      .catch(() => {
        setVoterAccounts([]);
      });
  }, []);

  return (
    <MainLayout title="Leaderboard">
      <LeaderboardWrapper>
        <TableWrapper>
          <p className="header-title">Addresses by Voting Weight</p>
          <Row className="table_header">
            <Col xs={{ span: 24 }} lg={{ span: 12 }} className="rank">
              Rank
            </Col>
            <Col xs={{ span: 8 }} lg={{ span: 4 }} className="votes right">
              Votes
            </Col>
            <Col
              xs={{ span: 8 }}
              lg={{ span: 4 }}
              className="vote-weight right"
            >
              Vote Weight
            </Col>
            <Col xs={{ span: 8 }} lg={{ span: 4 }} className="proposals right">
              Proposals Voted
            </Col>
          </Row>
          <div className="table_content">
            {(!voterAccounts ||
              (voterAccounts && voterAccounts.length === 0)) && (
              <p className="empty-voter center">No voters</p>
            )}
            {voterAccounts &&
              voterAccounts.map((item, index) => (
                <Row
                  className="table_item pointer"
                  key={index}
                  onClick={() => history.push(`/vote/address/${item.address}`)}
                >
                  <Col
                    xs={{ span: 24 }}
                    lg={{ span: 12 }}
                    className="flex align-center rank"
                  >
                    <div className="rank-number">{index + 1}</div>
                    <p>{item.address}</p>
                  </Col>
                  <Col
                    xs={{ span: 24 }}
                    lg={{ span: 4 }}
                    className="votes right"
                  >
                    <p className="mobile-label">Votes</p>
                    <p>
                      {format(
                        BigNumber(Web3.utils.fromWei(item.votes, 'ether'))
                          .dp(8, 1)
                          .toString(10)
                      )}
                    </p>
                  </Col>
                  <Col
                    xs={{ span: 24 }}
                    lg={{ span: 4 }}
                    className="vote-weight right"
                  >
                    <p className="mobile-label">Vote Weight</p>
                    <p>{parseFloat(item.voteWeight * 100).toFixed(2)}%</p>
                  </Col>
                  <Col
                    xs={{ span: 24 }}
                    lg={{ span: 4 }}
                    className="proposals right"
                  >
                    <p className="mobile-label">Proposals Voted</p>
                    <p>{item.proposalsVoted}</p>
                  </Col>
                </Row>
              ))}
          </div>
        </TableWrapper>
      </LeaderboardWrapper>
    </MainLayout>
  );
}

VoterLeaderboard.propTypes = {
  history: PropTypes.object,
  getVoterAccounts: PropTypes.func.isRequired
};

VoterLeaderboard.defaultProps = {
  history: {}
};

const mapDispatchToProps = dispatch => {
  const { getVoterAccounts } = accountActionCreators;

  return bindActionCreators(
    {
      getVoterAccounts
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(undefined, mapDispatchToProps)
)(VoterLeaderboard);
