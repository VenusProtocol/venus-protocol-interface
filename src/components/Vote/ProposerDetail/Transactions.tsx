/* eslint-disable no-useless-escape */
import React, { useState, useEffect } from 'react';
import { Icon } from 'antd';
import styled from 'styled-components';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { format } from 'utilities/common';
import { Card } from 'components/Basic/Card';
import { uid } from 'react-uid';
import { Transaction } from 'types';
import { generateBscScanUrl } from 'utilities';

const TransactionsWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: var(--color-bg-primary);
  padding: 27px 36px 29px 30px;

  .title {
    font-size: 17px;
    font-weight: 900;
    color: var(--color-text-main);
    margin-bottom: 23px;
  }

  .action-column {
    width: 40%;
    text-align: left;
  }

  .age-column {
    width: 40%;
    text-align: left;
  }

  .result-column {
    width: 20%;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    word-break: break-word;
  }

  .header-text {
    font-size: 16px;
    font-weight: normal;
    padding: 15px 0;
    color: var(--color-text-secondary);
    border-bottom: 1px solid var(--color-bg-active);
    border-top: 1px solid var(--color-bg-active);
  }

  .row-text {
    font-size: 17px;
    font-weight: 500;
    padding: 15px 0;
    color: var(--color-text-main);
    border-bottom: 1px solid var(--color-bg-active);
  }

  .green-color {
    color: var(--color-green);
  }

  .red-color {
    color: var(--color-red);
  }

  .view-more {
    margin-top: auto;
    padding-top: 20px;
    font-size: 16px;
    font-weight: bold;
    color: var(--color-text-main);
  }
`;

interface Props extends RouteComponentProps {
  address: string;
  transactions: Transaction[];
}

interface FormatTransaction {
  action: 'Received Votes' | 'Lost Votes' | 'Received XVS' | 'Sent XVS';
  age: string;
  result: string;
  isReceived: boolean;
}

function Transactions({ address, transactions }: Props) {
  const [data, setData] = useState<FormatTransaction[]>([]);

  const getDate = (timestamp: number) => {
    const startDate = moment(timestamp * 1000);
    const curDate = moment(new Date());
    const duration = moment.duration(curDate.diff(startDate));

    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours()) - days * 24;
    return `${days} days${hours ? `, ${hours}hrs` : ''} ago`;
  };

  useEffect(() => {
    const tempData: FormatTransaction[] = [];

    transactions.forEach((tx: Transaction) => {
      if (tx.type === 'vote') {
        tempData.push({
          action: tx.support ? 'Received Votes' : 'Lost Votes',
          age: getDate(tx.blockTimestamp),
          result: format(new BigNumber(tx.votes).div(new BigNumber(10).pow(18)), 4),
          isReceived: tx.support,
        });
      } else {
        tempData.push({
          action: tx.to.toLowerCase() === address.toLowerCase() ? 'Received XVS' : 'Sent XVS',
          age: getDate(tx.blockTimestamp),
          result: format(new BigNumber(tx.amount).div(new BigNumber(10).pow(18)), 4),
          isReceived: tx.to.toLowerCase() === address.toLowerCase(),
        });
      }
    });
    setData([...tempData]);
  }, [transactions, address]);

  const handleLink = () => {
    window.open(generateBscScanUrl(address), '_blank');
  };
  return (
    <Card>
      <TransactionsWrapper className="flex flex-column">
        <div className="title">Transactions</div>
        <div className="flex algin-center header-text">
          <div className="action-column">Action</div>
          <div className="age-column">Age</div>
          <div className="result-column">Result</div>
        </div>
        <div className="flex flex-column data-list">
          {data &&
            data.map(item => (
              <div className="flex align-center row-text" key={uid(item)}>
                <div className="action-column">{item.action}</div>
                <div className="age-column">{item.age}</div>
                <div className="result-column">
                  <span>{item.result}</span>
                  {item.isReceived ? (
                    <Icon type="arrow-up" className="green-color" />
                  ) : (
                    <Icon type="arrow-down" className="red-color" />
                  )}
                </div>
              </div>
            ))}
        </div>
        <div
          className="flex align-center just-center view-more pointer highlight"
          onClick={() => handleLink()}
        >
          VIEW MORE
        </div>
      </TransactionsWrapper>
    </Card>
  );
}

Transactions.defaultProps = {
  address: '',
  transactions: [],
};

export default withRouter(Transactions);
