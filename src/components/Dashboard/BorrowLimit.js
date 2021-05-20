import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LineProgressBar from 'components/Basic/LineProgressBar';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import { compose } from 'recompose';
import { connectAccount } from 'core';
import { Card } from 'components/Basic/Card';
import { getBigNumber } from 'utilities/common';

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
const abortController = new AbortController();

function BorrowLimit({ settings }) {
  const [available, setAvailable] = useState('0');
  const [borrowPercent, setBorrowPercent] = useState(0);

  useEffect(() => {
    if (settings.selectedAddress) {
      const totalBorrowBalance = getBigNumber(settings.totalBorrowBalance);
      const totalBorrowLimit = getBigNumber(settings.totalBorrowLimit);
      const total = BigNumber.maximum(totalBorrowLimit, 0);
      setAvailable(total.dp(2, 1).toString(10));
      setBorrowPercent(
        total.isZero() || total.isNaN()
          ? 0
          : totalBorrowBalance
              .div(total)
              .times(100)
              .dp(0, 1)
              .toNumber()
      );
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.totalBorrowBalance, settings.totalBorrowLimit]);

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

BorrowLimit.propTypes = {
  settings: PropTypes.object
};

BorrowLimit.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(BorrowLimit);
