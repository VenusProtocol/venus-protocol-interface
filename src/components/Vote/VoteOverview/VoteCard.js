import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import commaNumber from 'comma-number';
import styled from 'styled-components';
import Web3 from 'web3';
import { Card } from 'components/Basic/Card';
import { Icon, Tooltip } from 'antd';

const VoteCardWrapper = styled.div`
  width: 100%;
  background-color: var(--color-bg-primary);
  border-radius: 20px;
  padding: 24px;

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
    .for {
      background: var(--color-dark-green);
    }
    .against {
      background: var(--color-purple);
    }
    .abstain {
      background: var(--color-dark-grey);
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

  .reason-icon {
    font-size: 15px;
    color: #a1a1a1;
    cursor: pointer;
    margin-left: 8px;
    &:hover {
      color: var(--color-gold);
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
    margin-top: 21px;

    p {
      font-size: 16px;
      font-weight: bold;
      color: var(--color-text-main);
    }
  }

  .loading-icon {
    color: #fff;
    font-size: 36px;
    padding-top: 15px;
    width: 100%;
  }
`;

const format = commaNumber.bindWith(',', '.');

function VoteCard({
  type,
  history,
  label,
  voteNumber,
  totalNumber,
  addressNumber,
  emptyNumber,
  list,
  onViewAll
}) {
  const [isViewAll, setIsViewAll] = useState(true);
  const [percent, setPercent] = useState(0);

  const remainingToLoad = addressNumber - list.length;

  useEffect(() => {
    const percentTmp = new BigNumber(voteNumber)
      .multipliedBy(100)
      .div(totalNumber);
    setPercent(percentTmp.isNaN() ? '0' : percentTmp.toString(10));
  }, [voteNumber]);

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
                    voteNumber.isNaN() ? '' : voteNumber.toString(10),
                    'ether'
                  )
                )
                  .dp(8, 1)
                  .toString(10)
              )}
            </span>
          </div>
          <div
            className={`status-bar ${['against', 'for', 'abstain'][type]}`}
            style={{
              width: `${percent}%`
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
                <div>
                  <span>
                    {format(
                      new BigNumber(Web3.utils.fromWei(l.value, 'ether'))
                        .dp(8, 1)
                        .toString(10)
                    )}
                  </span>
                  {l.reason && (
                    <Tooltip
                      placement="top"
                      title={l.reason}
                      trigger={['click']}
                      overlayStyle={{
                        maxHeight: '500px',
                        overflowY: 'scroll'
                      }}
                    >
                      <Icon
                        className="reason-icon"
                        type="exclamation-circle"
                        theme="filled"
                      />
                    </Tooltip>
                  )}
                </div>
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
          {/* view all is clicked and there are still empty lines to fill up */}
          {!isViewAll && remainingToLoad > 0 && (
            <Icon className="loading-icon" type="loading" />
          )}
          {isViewAll && remainingToLoad > 0 && (
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
  type: PropTypes.number,
  history: PropTypes.object,
  label: PropTypes.string,
  voteNumber: PropTypes.object,
  totalNumber: PropTypes.object,
  addressNumber: PropTypes.number,
  emptyNumber: PropTypes.number,
  list: PropTypes.array,
  onViewAll: PropTypes.func.isRequired
};

VoteCard.defaultProps = {
  type: 0,
  history: {},
  label: '',
  voteNumber: new BigNumber(0),
  totalNumber: new BigNumber(0),
  addressNumber: 0,
  emptyNumber: 0,
  list: []
};

export default compose(withRouter)(VoteCard);
