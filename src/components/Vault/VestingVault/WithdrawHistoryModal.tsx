import React from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { uid } from 'react-uid';

import closeImg from 'assets/img/close.png';
import { getToken } from 'utilities';
import { TokenId } from 'types';

const WithdrawHistoryModalWrapper = styled.div`
  color: #fff;
  .title {
    text-align: center;
    font-size: 14px;
    line-height: 16px;
    padding-top: 19px;
    margin-bottom: 43px;
  }

  .subtitle {
    font-size: 16px;
    line-height: 19px;
    margin-left: 24px;
  }

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .list {
    padding: 24px;
  }
  .list-title {
    color: #a1a1a1;
    font-size: 14px;
    line-height: 16px;
  }
  .list-items {
    font-size: 14px;
    line-height: 16px;
    color: #fff;
  }
  .table-line {
    display: flex;
    border-bottom: 1px solid #262b48;
    padding: 11px 0;
    .left {
      width: 60%;
      text-align: left;
    }
    .right {
      width: 40%;
      text-align: left;
    }
  }
`;

interface WithdrawHistoryModalProps {
  visible: boolean;
  onCancel: () => void;
  pendingWithdrawals: unknown[];
  withdrawableAmount: BigNumber;
  stakedToken: TokenId;
}

function WithdrawHistoryModal({
  visible,
  onCancel,
  pendingWithdrawals,
  withdrawableAmount,
  stakedToken,
}: WithdrawHistoryModalProps) {
  const stakedTokenDecimal = new BigNumber(10).pow(getToken(stakedToken).decimals);
  return (
    <Modal
      className="venus-modal"
      width={448}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      maskClosable
      centered
    >
      <WithdrawHistoryModalWrapper>
        <img className="close-btn pointer" src={closeImg} alt="close" onClick={onCancel} />
        <div className="title">Request Withdrawal List</div>
        <div className="subtitle">
          Withdrawable amount: {withdrawableAmount.div(stakedTokenDecimal).dp(4, 1).toString(10)}{' '}
          {stakedToken.toUpperCase()}
        </div>
        <div className="list">
          <div className="list-title table-line">
            <span className="left">Amount</span>
            <span className="right">Locked Until</span>
          </div>
          <div className="list-items">
            {pendingWithdrawals.map((withdraw: $TSFixMe) => (
              <div key={uid(withdraw)} className="table-line">
                <span className="left">
                  {withdraw.amount.div(stakedTokenDecimal).dp(4, 1).toString(10)}{' '}
                  {stakedToken.toUpperCase()}
                </span>
                <span className="right">
                  {moment(new Date(withdraw.lockedUntil.toNumber(10) * 1000)).format(
                    'DD/MM/YYYY HH:mm:ss',
                  )}{' '}
                </span>
              </div>
            ))}
          </div>
        </div>
      </WithdrawHistoryModalWrapper>
    </Modal>
  );
}

export default WithdrawHistoryModal;
