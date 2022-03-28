import React from 'react';
import styled from 'styled-components';
import LineProgressBar from 'components/Basic/LineProgressBar';
import { formatCommaThousandsPeriodDecimal } from 'utilities/common';
import { Card } from 'components/Basic/Card';
import { useBorrowLimit } from '../../hooks/useBorrowLimit';

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
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

function BorrowLimit() {
  const { available, borrowPercent } = useBorrowLimit();
  return (
    <Card>
      <CardWrapper>
        <p className="usd-price">${formatCommaThousandsPeriodDecimal(available)}</p>
        <p className="credit-text">Available Credit</p>
        <LineProgressBar label="Borrow Limit" percent={borrowPercent} />
      </CardWrapper>
    </Card>
  );
}

export default BorrowLimit;
