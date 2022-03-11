/* eslint-disable no-useless-escape */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Pagination } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Voting from 'components/Basic/Voting';
import arrowRightImg from 'assets/img/arrow-right.png';
import { Card } from 'components/Basic/Card';
import { uid } from 'react-uid';

const VotingHistoryWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: var(--color-bg-primary);
  padding: 28px 30px 30px;

  .header {
    font-size: 17px;
    font-weight: 900;
    color: var(--color-text-main);
    padding-bottom: 17px;
    border-bottom: 1px solid var(--color-bg-active);
  }

  .footer {
    margin-top: 40px;
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

interface VotingHistoryProps extends RouteComponentProps {
  data: {
    proposalId?: number;
    description?: string;
    state?: string;
  }[];
  pageNumber?: number;
  total: number;
  onChangePage: (page: number, prev: number, size: number) => void;
}

function VotingHistory({ data, pageNumber, total, onChangePage }: VotingHistoryProps) {
  const [current, setCurrent] = useState(pageNumber || 1);
  const [pageSize, setPageSize] = useState(5);

  const handleChangePage = (page: number, size?: number) => {
    setCurrent(page);
    if (size) {
      setPageSize(size);
      onChangePage(page, (page - 1) * size, size);
    }
  };

  const onNext = () => {
    handleChangePage(current + 1, 5);
  };

  const onPrev = () => {
    handleChangePage(current - 1, 5);
  };

  return (
    <Card>
      <VotingHistoryWrapper className="flex flex-column">
        <div className="header">Voting History</div>
        <div className="body">
          {/**/}
          {data.map((item: $TSFixMe) => (
            <Voting proposal={item.proposal} support={item.support} key={uid(item)} />
          ))}
        </div>
        {data && data.length !== 0 && (
          <div className="flex align-center just-between footer">
            <Pagination
              size="small"
              defaultCurrent={1}
              defaultPageSize={5}
              current={current}
              pageSize={pageSize}
              total={total}
              onChange={handleChangePage}
            />
            <div className="flex just-between align-center button">
              {current * pageSize < total && (
                <div className="flex align-center button-next" onClick={onNext}>
                  <span>Next</span>
                  <img src={arrowRightImg} alt="arrow" />
                </div>
              )}
              {current > 1 && (
                <div className="flex align-center button-prev" onClick={onPrev}>
                  <img src={arrowRightImg} alt="arrow" />
                  <span>Prev</span>
                </div>
              )}
            </div>
          </div>
        )}
      </VotingHistoryWrapper>
    </Card>
  );
}

VotingHistory.defaultProps = {
  data: [],
  pageNumber: 1,
  total: 0,
};

export default withRouter(VotingHistory);
