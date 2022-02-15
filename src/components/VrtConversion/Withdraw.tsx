import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import { ButtonWrapper } from './styles';

const WithdrawWrapper = styled.div`
  .withdraw-title {
    text-align: center;
    color: #ffffff;
    &-line-1 {
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 8px;
    }
    &-line-2 {
      font-size: 24px;
      font-weight: 500;
      line-height: 28px;
      margin-bottom: 32px;
    }
  }

  .withdraw-button {
    width: 100%;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
  }
`;

const commaFormatter = commaNumber.bindWith(',', '.');

export type WithdrawPropsType = {
  withdrawableAmount: BigNumber;
  account: string;
  handleClickWithdraw: () => void;
};

export default ({ withdrawableAmount, account, handleClickWithdraw }: WithdrawPropsType) =>
(
  <WithdrawWrapper>
    <div className="withdraw-title">
      <div className="withdraw-title-line-1">Withdrawable amount</div>
      <div className="withdraw-title-line-2">
        {commaFormatter(withdrawableAmount.toFixed(4))}
        {' '}
        XVS
      </div>
    </div>
    <ButtonWrapper>
      <button
        type="button"
        className="button withdraw-button"
        disabled={!account}
        onClick={handleClickWithdraw}
      >
        {!account ? 'Connect' : 'Withdraw'}
      </button>
    </ButtonWrapper>
  </WithdrawWrapper>
);
