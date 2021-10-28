import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LineProgressBar from 'components/Basic/LineProgressBar';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import { Card } from 'components/Basic/Card';
import { useWeb3React } from '@web3-react/core';
import { useMarketsUser } from '../../hooks/useMarketsUser';

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 25px;
  background-color: #181c3a;
  background-image: linear-gradient(to right, #f2c265, #f7b44f);
  padding: 20px 30px;

  .usd-price {
    font-size: 28.5px;
    font-weight: 900;
    color: var(--color-text-main);
  }
  .credit-text {
    font-size: 13.5px;
    font-weight: 900;
    color: var(--color-text-main);
  }
`;

const format = commaNumber.bindWith(',', '.');

function BorrowLimit({ settings }) {
  const [available, setAvailable] = useState('0');
  const [borrowPercent, setBorrowPercent] = useState(0);
  const { account } = useWeb3React();
  const { userTotalBorrowBalance, userTotalBorrowLimit } = useMarketsUser();

  useEffect(() => {
    if (account) {
      const total = BigNumber.maximum(userTotalBorrowLimit, 0);
      setAvailable(total.dp(2, 1).toString(10));
      setBorrowPercent(
        total.isZero() || total.isNaN()
          ? 0
          : userTotalBorrowBalance
              .div(total)
              .times(100)
              .dp(0, 1)
              .toNumber()
      );
    }
  }, [userTotalBorrowBalance, userTotalBorrowLimit]);

  return (
    <Card>
      <CardWrapper>
        <p className="usd-price">${format(available)}</p>
        <p className="credit-text">Available Credit</p>
        <LineProgressBar label="Borrow Limit" percent={borrowPercent} />
      </CardWrapper>
    </Card>
  );
}

export default BorrowLimit;
