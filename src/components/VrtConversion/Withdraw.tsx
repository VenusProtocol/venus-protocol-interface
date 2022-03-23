import React, { useState } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { PrimaryButton } from 'components';
import { formatCommaThousandsPeriodDecimal } from 'utilities/common';

const WithdrawWrapper = styled.div`
  .withdraw-title {
    text-align: center;
    color: #fff;
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
`;

export type WithdrawPropsType = {
  withdrawableAmount: BigNumber;
  account: string;
  handleClickWithdraw: () => void;
};

export default ({ withdrawableAmount, account, handleClickWithdraw }: WithdrawPropsType) => {
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  return (
    <WithdrawWrapper>
      <div className="withdraw-title">
        <div className="withdraw-title-line-1">Withdrawable amount</div>
        <div className="withdraw-title-line-2">
          {formatCommaThousandsPeriodDecimal(withdrawableAmount.toFixed(6))} XVS
        </div>
      </div>
      <PrimaryButton
        type="button"
        fullWidth
        loading={withdrawLoading}
        disabled={!account || !withdrawableAmount.gt(0) || withdrawLoading}
        onClick={async () => {
          setWithdrawLoading(true);
          await handleClickWithdraw();
          setWithdrawLoading(false);
        }}
      >
        {!account ? 'Connect' : 'Withdraw'}
      </PrimaryButton>
    </WithdrawWrapper>
  );
};
