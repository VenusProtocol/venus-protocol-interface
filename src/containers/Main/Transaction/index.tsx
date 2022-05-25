import React, { useEffect, useState, useCallback } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Row, Col, Pagination, Select } from 'antd';
import styled from 'styled-components';
import { connectAccount } from 'core';
import { Label } from 'components/Basic/Label';
import { formatCommaThousandsPeriodDecimal } from 'utilities/common';
import { promisify, generateBscScanUrl } from 'utilities';
import moment from 'moment';
import arrowRightImg from 'assets/img/arrow-right.png';
import xvsImg from 'assets/img/coins/xvs.svg';
import { uid } from 'react-uid';

const TransactionWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TableWrapper = styled.div`
  position: relative;
  width: 100%;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-bg-primary);
  box-sizing: content-box;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  margin: 20px 0;
  max-width: 1200px;

  .vai-apy {
    color: var(--color-green);
    font-size: 18px;
    margin: 0 80px;
    padding-bottom: 20px;
    font-weight: bold;
    border-bottom: 1px solid var(--color-bg-active);
  }

  .table_header {
    padding: 10px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    > div {
      color: #a1a1a1;
      font-weight: bold;
      img {
        width: 16px;
        height: 16px;
        margin: 0 10px;
      }
    }
    @media (max-width: 992px) {
      .id,
      .type,
      .hash,
      .block,
      .from,
      .to,
      .amount,
      .date {
        display: none;
      }
    }
  }
  .table_content {
    .table_item {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      padding: 10px 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      border-left: 2px solid transparent;
      &:hover {
        background-color: var(--color-bg-active);
        border-left: 2px solid var(--color-yellow);
      }
      div {
        color: var(--color-white);
        max-width: 100%;
      }

      .ant-col {
        @media (max-width: 992px) {
          margin: 5px 0;
        }
      }
      .mobile-label {
        display: none;
        @media (max-width: 992px) {
          font-weight: bold;
          display: block;
          color: var(--color-yellow);
        }
      }
      .item-title {
        font-weight: 600;
        font-size: 16px;
        color: var(--color-white);
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .hash,
      .from,
      .to {
        .item-title {
          color: #09d395;
          cursor: pointer;
        }
      }
      .item-value {
        font-weight: 600;
        font-size: 14px;
        color: var(--color-text-secondary);
      }

      .type {
        display: flex;
        align-items: center;
        @media (max-width: 992px) {
          flex-direction: column;
          align-items: flex-start;
        }
        .highlight {
          word-break: break-all;
          white-space: break-spaces;
        }
        .asset-img {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }
      }
    }
  }

  .no-transaction {
    text-align: center;
    padding: 20px;
    color: white;
  }

  .footer {
    margin-top: 20px;
    padding: 20px;
    border-top: 1px solid var(--color-bg-main);

    .pages {
      font-size: 16px;
      color: var(--color-text-secondary);
    }

    .ant-pagination-prev,
    .ant-pagination-next {
      display: none;
    }

    .ant-pagination-item a {
      color: var(--color-text-main);
    }

    .ant-pagination-item-active {
      background: transparent;
      border-color: transparent;
      a {
        color: var(--color-orange);
      }
    }

    .ant-pagination-item:focus a,
    .ant-pagination-item:hover a {
      color: var(--color-orange);
    }

    .button {
      width: 200px;
      flex-direction: row-reverse;
      span {
        font-size: 16px;
        font-weight: 900;
        color: var(--color-text-main);
      }

      img {
        width: 26px;
        height: 16px;
        border-radius: 50%;
      }

      .button-prev {
        cursor: pointer;
        img {
          margin-right: 25px;
          transform: rotate(180deg);
        }
      }

      .button-next {
        cursor: pointer;
        span {
          margin-right: 25px;
        }
      }

      .button-prev:focus,
      .button-prev:hover,
      .button-next:focus,
      .button-next:hover {
        span {
          color: var(--color-orange);
        }
      }
    }
  }
`;

const AssetSelectWrapper = styled.div`
  position: relative;
  margin: 30px;
  .ant-select {
    .ant-select-selection {
      margin-left: 8px;
      border: 2px solid var(--color-bg-active);
      background-color: transparent;
      font-size: 17px;
      font-weight: 900;
      color: var(--color-text-main);
      i {
        color: var(--color-text-main);
      }
    }
  }
`;

const eventTypes = [
  'All',
  'Mint',
  'Transfer',
  'RepayBorrow',
  'Redeem',
  'Approval',
  'LiquidateBorrow',
  'ReservesAdded',
  'ReservesReduced',
  'MintVAI',
  'Withdraw',
  'RepayVAI',
  'Deposit',
  'VoteCast',
  'ProposalCreated',
  'ProposalQueued',
  'ProposalExecuted',
  'ProposalCanceled',
];

const { Option } = Select;

interface TransactionProps extends RouteComponentProps {
  getTransactionHistory: $TSFixMe;
}

function Transaction({ getTransactionHistory }: TransactionProps) {
  const [data, setData] = useState<$TSFixMe[]>([]);
  const [offset, setOffset] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [event, setEvent] = useState('All');
  const current = new Date();

  const loadTransactionHistory = useCallback(async () => {
    await promisify(getTransactionHistory, { offset, event })
      .then(res => {
        // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
        setData(res.data.result);
        // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
        setTotal(res.data.total);
      })
      .catch(() => {});
  }, [offset, event]);

  useEffect(() => {
    loadTransactionHistory();
  }, [loadTransactionHistory]);

  const handleChangePage = (page: number, size?: number) => {
    setOffset(page);
    if (size) {
      setPageSize(size);
    }
  };

  const onNext = () => {
    handleChangePage(offset + 1, 20);
  };

  const onPrev = () => {
    handleChangePage(offset - 1, 20);
  };

  const diffFormat = (secs: $TSFixMe) => {
    let minutes = Math.floor(secs / 60);
    let hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    hours %= 24;
    minutes %= 60;
    if (days > 0) {
      return `${days} days ago`;
    }
    if (hours > 0) {
      return `${hours} hours ago`;
    }
    return `${minutes} mins ago`;
  };

  return (
    <TransactionWrapper>
      <TableWrapper>
        <AssetSelectWrapper className="flex align-center just-end" id="event-type">
          <Label size="16" primary>
            Type:
          </Label>

          <Select
            defaultValue="All"
            style={{ width: 200, marginRight: 10 }}
            // @ts-expect-error ts-migrate(2322) FIXME: Type '() => HTMLElement | null' is not assignable ... Remove this comment to see the full error message
            getPopupContainer={() => document.getElementById('event-type')}
            dropdownMenuStyle={{
              backgroundColor: 'var(--color-bg-main)',
            }}
            dropdownClassName="asset-select"
            onChange={val => {
              setOffset(1);
              setEvent(val);
            }}
          >
            {eventTypes.map((eventType, index) => (
              <Option
                className="flex align-center just-between"
                value={eventType}
                key={uid(`${eventType}-${index}`)}
              >
                <span>{eventType}</span>
              </Option>
            ))}
          </Select>
        </AssetSelectWrapper>
        <Row className="table_header">
          <Col xs={{ span: 24 }} lg={{ span: 2 }} className="id">
            ID
          </Col>
          <Col xs={{ span: 6 }} lg={{ span: 4 }} className="type">
            Type
          </Col>
          <Col xs={{ span: 6 }} lg={{ span: 3 }} className="hash">
            Txn Hash
          </Col>
          <Col xs={{ span: 6 }} lg={{ span: 2 }} className="block">
            Block
          </Col>
          <Col xs={{ span: 6 }} lg={{ span: 4 }} className="from">
            From
          </Col>
          <Col xs={{ span: 6 }} lg={{ span: 4 }} className="to">
            To
          </Col>
          <Col xs={{ span: 6 }} lg={{ span: 3 }} className="amount">
            Amount
          </Col>
          <Col xs={{ span: 6 }} lg={{ span: 2 }} className="date">
            Created At
          </Col>
        </Row>
        <div className="table_content">
          {data &&
            data.length > 0 &&
            data.map(item => (
              <Row className="table_item" key={uid(item)}>
                <Col xs={{ span: 24 }} lg={{ span: 2 }} className="id">
                  <p className="mobile-label">ID</p>
                  <p className="item-title">{item.id}</p>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 4 }} className="type">
                  <p className="mobile-label">Type</p>
                  <img className="asset-img" src={xvsImg} alt="asset" />
                  <p className="item-title">{item.event}</p>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 3 }} className="hash">
                  <p className="mobile-label">Txn Hash</p>
                  <p
                    className="item-title"
                    onClick={() => {
                      window.open(generateBscScanUrl(item.transactionHash, 'tx'), '_blank');
                    }}
                  >
                    {`${item.transactionHash.slice(0, 6)}...${item.transactionHash.slice(-6)}`}
                  </p>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 2 }} className="block">
                  <p className="mobile-label">Block</p>
                  <p className="item-title">{item.blockNumber}</p>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 4 }} className="from">
                  <p className="mobile-label">From</p>
                  <p
                    className="item-title"
                    onClick={() => {
                      window.open(generateBscScanUrl(item.from), '_blank');
                    }}
                  >
                    {item.from && `${item.from.slice(0, 6)}...${item.from.slice(-6)}`}
                  </p>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 4 }} className="to">
                  <p
                    className="mobile-label"
                    onClick={() => {
                      window.open(generateBscScanUrl(item.to), '_blank');
                    }}
                  >
                    To
                  </p>
                  <p
                    className="item-title"
                    onClick={() => {
                      window.open(generateBscScanUrl(item.to), '_blank');
                    }}
                  >
                    {item.to && `${item.to.slice(0, 6)}...${item.to.slice(-6)}`}
                  </p>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 3 }} className="amount">
                  <p className="mobile-label">Amount</p>
                  <p className="item-title">
                    {item.amount < 0.00001 && item.amount > 0
                      ? '< 0.00001'
                      : formatCommaThousandsPeriodDecimal(item.amount)}
                  </p>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 2 }} className="date">
                  <p className="mobile-label">Created At</p>
                  <p className="item-title">
                    {diffFormat(moment(current).diff(moment(item.createdAt), 'seconds'))}
                  </p>
                </Col>
              </Row>
            ))}
        </div>
        {data && data.length !== 0 ? (
          <div className="flex align-center just-between footer">
            <Pagination
              size="small"
              defaultCurrent={1}
              defaultPageSize={5}
              current={offset}
              pageSize={pageSize}
              total={total}
              onChange={handleChangePage}
            />
            <div className="flex just-between align-center button">
              {offset * pageSize < total && (
                <div className="flex align-center button-next" onClick={onNext}>
                  <span>Next</span>
                  <img src={arrowRightImg} alt="arrow" />
                </div>
              )}
              {offset > 1 && (
                <div className="flex align-center button-prev" onClick={onPrev}>
                  <img src={arrowRightImg} alt="arrow" />
                  <span>Prev</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="no-transaction">No Transactions</div>
        )}
      </TableWrapper>
    </TransactionWrapper>
  );
}

export default connectAccount(null)(withRouter(Transaction));
