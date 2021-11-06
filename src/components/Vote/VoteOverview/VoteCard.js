import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import commaNumber from 'comma-number';
import styled from 'styled-components';
import Web3 from 'web3';
import { Card } from 'components/Basic/Card';
import { Modal } from 'antd';
import closeImg from 'assets/img/close.png';

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
      .reason-text {
        cursor: pointer;
        color: var(--color-orange);
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

const ModalContentWrapper = styled.div`
  border-radius: 20px;
  background-color: var(--color-bg-primary);
  height: 200px;

  .close-btn {
    position: absolute;
    top: 30px;
    right: 23px;
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
  const [reasonForShow, setReasonForShow] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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
            className={`status-bar ${type}`}
            style={{
              width: `${percent}%`
            }}
          />
        </div>
        <VoteList>
          <div className="flex align-center just-between header">
            <span>{addressNumber} addresses</span>
            <span>Votes</span>
            <span>Reason</span>
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
                <span
                  className="reason-text"
                  onClick={() => {
                    setReasonForShow(l.reason);
                    setModalVisible(true);
                  }}
                >
                  Reason
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
        <Modal
          className="connect-modal"
          visible={modalVisible}
          footer={null}
          closable={false}
          width={450}
          maskClosable
          centered
          onCancel={() => setModalVisible(false)}
        >
          <ModalContentWrapper>
            <img
              className="close-btn pointer"
              src={closeImg}
              alt="close"
              onClick={() => setModalVisible(false)}
            />
            <div>{reasonForShow}</div>
          </ModalContentWrapper>
        </Modal>
      </VoteCardWrapper>
    </Card>
  );
}

VoteCard.propTypes = {
  type: PropTypes.string,
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
  type: '',
  history: {},
  label: '',
  voteNumber: new BigNumber(0),
  totalNumber: new BigNumber(0),
  addressNumber: 0,
  emptyNumber: 0,
  list: []
};

export default compose(withRouter)(VoteCard);
