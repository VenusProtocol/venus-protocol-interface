import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MarketTableWrapper = styled.div`
  border-top: 1px solid var(--color-bg-active);
  .all-title {
    padding: 16px;
    font-size: 20px;
    font-weight: 600;
    color: var(--color-text-main);
  }

  img {
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }

  .apy-content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #9dd562;

    .apy-green-label {
      width: 80px;
      font-size: 14px;
      font-weight: 600;
    }
    .apy-red-label {
      width: 80px;
      font-size: 14px;
      font-weight: 600;
      color: #f9053e;
    }
  }

  .ant-table-fixed-header {
    .ant-table-scroll {
      .ant-table-header {
        background: var(--color-bg-primary);
        /* width */
        &::-webkit-scrollbar {
          display: none;
        }
      }
      .ant-table-body {
        /* width */
        &::-webkit-scrollbar {
          background: var(--color-bg-primary);
          width: 7px;
        }

        /* Handle */
        &::-webkit-scrollbar-thumb {
          -webkit-border-radius: 3px;
          background-color: var(--color-primary);
        }

        /* Handle on hover */
        &::-webkit-scrollbar-thumb:hover {
          background: #e53d52;
        }

        ::-webkit-scrollbar-track {
          -webkit-border-radius: 3px;
          background: var(--color-bg-main);
        }

        ::-webkit-scrollbar-corner {
          background-color: transparent;
        }
      }
    }
  }

  .ant-table-thead {
    tr {
      th {
        color: var(--color-text-secondary);
        font-size: 16px;
        font-weight: normal;
        background: var(--color-bg-primary);
        border-bottom: 0px;
        -webkit-transition: background 0.3s ease;
        transition: background 0.3s ease;
        text-align: right;
        width: 28%;

        &:first-child {
          width: 16%;
        }

        &:nth-child(1) {
          text-align: left;
        }

        @media only screen and (max-width: 768px) {
          padding: 5px;
          &:nth-child(2) {
            display: none;
          }
        }
      }
    }
  }

  .ant-table-tbody {
    tr {
      td {
        border-bottom: 0px;
        background: var(--color-bg-primary);
        text-align: right;
        width: 28%;

        &:first-child {
          width: 16%;
        }

        &:nth-child(1) {
          text-align: left;

          span:nth-child(2) {
            display: none;
          }
        }

        @media only screen and (max-width: 768px) {
          padding: 5px;
          &:nth-child(1) {
            text-align: left;

            span:nth-child(2) {
              display: block;
              color: #9dd562;
            }
          }
          &:nth-child(2) {
            display: none;
          }
        }
      }
    }
    tr:hover {
      cursor: pointer;
    }
    tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
      background: var(--color-bg-active);
    }
  }
`;

function MarketTable({ columns, data, title, handleClickRow }) {
  return (
    <MarketTableWrapper>
      <div className="all-title">{title}</div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        onRow={row => {
          return {
            onClick: () => handleClickRow(row) // click row
          };
        }}
      />
    </MarketTableWrapper>
  );
}

MarketTable.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  title: PropTypes.string,
  handleClickRow: PropTypes.func.isRequired
};

MarketTable.defaultProps = {
  data: [],
  columns: [],
  title: ''
};

export default MarketTable;
