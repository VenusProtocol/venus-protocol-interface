import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import commaNumber from 'comma-number';
import styled from 'styled-components';
import Web3 from 'web3';
import { Card } from 'components/Basic/Card';

const VoteCardWrapper = styled.div`
  width: 100%;
  background-color: var(--color-bg-primary);
  border-radius: 20px;
  padding: 38px 41px;

  .header-card {
    width: 100%;
    .vote-count {
      span {
        font-size: 17px;
        font-weight: 900;
        color: var(--color-text-main);
      }
    }
    .status-bar {
      height: 5px;
      border-radius: 27px;
      margin-top: 19px;
    }
    .agree {
      background: var(--color-dark-green);
    }
    .against {
      background: var(--color-purple);
    }
  }
`;

const VoteList = styled.div`
  margin-top: 28px;

  .header {
    width: 100%;
    span {
      font-size: 16px;
      color: var(--color-text-secondary);
    }
  }
  .vote-list {
    width: 100%;
    max-height: 400px;
    overflow: auto;

    .vote-item {
      width: 100%;
      border-top: 1px solid var(--color-bg-active);
      border-bottom: 1px solid var(--color-bg-active);
      padding: 10px 0px;
      span {
        font-weight: 600;
        font-size: 16px;
        color: var(--color-text-main);
      }
      .pointer {
        &:hover {
          font-weight: bold;
          color: var(--color-orange);
        }
      }
    }
    .empty-item {
      span {
        color: var(--color-text-secondary);
      }
    }
  }

  .view-all {
    width: 100%;
    padding: 15px 0;
    margin-top: 21px;

    p {
      font-size: 16px;
      font-weight: bold;
      color: var(--color-text-main);
    }
  }
`;

const format = commaNumber.bindWith(',', '.');

function VoteCard({
  history,
  label,
  forNumber,
  againstNumber,
  type,
  addressNumber,
  emptyNumber,
  list,
  onViewAll
}) {
  const [isViewAll, setIsViewAll] = useState(true);
  const [forPercent, setForPercent] = useState(0);
  const [againstPercent, setAgainstPercent] = useState(0);

  useEffect(() => {
    const total = new BigNumber(forNumber).plus(new BigNumber(againstNumber));
    setForPercent(
      new BigNumber(forNumber * 100).div(total).isNaN()
        ? '0'
        : new BigNumber(forNumber * 100).div(total).toString(10)
    );
    setAgainstPercent(
      new BigNumber(againstNumber * 100).div(total).isNaN()
        ? '0'
        : new BigNumber(againstNumber * 100).div(total).toString(10)
    );
  }, [forNumber, againstNumber]);

  const handleAddLink = v => {
    history.push(`/vote/address/${v}`);
  };

  const emptyList = [];
  if (emptyNumber > 0) {
    for (let i = 0; i < emptyNumber; i += 1) {
      emptyList.push(i);
    }
  }
  return (
    <Card>
      <VoteCardWrapper>
        <div className="header-card">
          <div className="flex align-center just-between vote-count">
            <span>{label}</span>
            <span>
              {format(
                new BigNumber(
                  Web3.utils.fromWei(
                    type === 'agree' ? forNumber : againstNumber,
                    'ether'
                  )
                )
                  .dp(8, 1)
                  .toString(10)
              )}
            </span>
          </div>
          <div
            className={`status-bar ${type === 'agree' ? 'agree' : 'against'}`}
            style={{
              width: `${type === 'agree' ? forPercent : againstPercent}%`
            }}
          />
        </div>
        <VoteList>
          <div className="flex align-center just-between header">
            <span>{addressNumber} addresses</span>
            <span>Votes</span>
          </div>
          <div className="vote-list scrollbar">
            {list.map((l, index) => (
              <div
                className="flex align-center just-between vote-item"
                key={index}
              >
                <span
                  className="pointer"
                  onClick={() => handleAddLink(l.label)}
                >
                  {l.label
                    ? `${l.label.substr(0, 5)}...${l.label.substr(-4, 4)}`
                    : ''}
                </span>
                <span>
                  {format(
                    new BigNumber(Web3.utils.fromWei(l.value, 'ether'))
                      .dp(8, 1)
                      .toString(10)
                  )}
                </span>
              </div>
            ))}
            {emptyList.map(v => (
              <div
                className="flex align-center just-between vote-item empty-item"
                key={v}
              >
                <span>—</span>
                <span>—</span>
              </div>
            ))}
          </div>
          {isViewAll && addressNumber > 3 && (
            <div
              className="flex align-center just-center view-all pointer"
              onClick={() => {
                setIsViewAll(false);
                onViewAll();
              }}
            >
              <p>View all</p>
            </div>
          )}
        </VoteList>
      </VoteCardWrapper>
    </Card>
  );
}

VoteCard.propTypes = {
  history: PropTypes.object,
  label: PropTypes.string,
  forNumber: PropTypes.string,
  againstNumber: PropTypes.string,
  type: PropTypes.string,
  addressNumber: PropTypes.number,
  emptyNumber: PropTypes.number,
  list: PropTypes.array,
  onViewAll: PropTypes.func.isRequired
};

VoteCard.defaultProps = {
  history: {},
  label: '',
  forNumber: '0',
  againstNumber: '0',
  type: 'agree',
  addressNumber: 0,
  emptyNumber: 0,
  list: []
};

export default compose(withRouter)(VoteCard);
