import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import commaNumber from 'comma-number';
import { Row, Col, Icon } from 'antd';
import styled from 'styled-components';
import { connectAccount } from 'core';
import MainLayout from 'containers/Layout/MainLayout';
import { getVaiTokenContract, methods } from 'utilities/ContractService';

import * as constants from 'utilities/constants';
import { currencyFormatter } from 'utilities/common';

const MarketWrapper = styled.div`
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
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.03);
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

  @media (max-width: 768px) {
    width: 90%;
  }

  .total-info {
    background: #0f1331;
    border-radius: 16px;
    margin: 30px 80px;
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;

    @media (max-width: 992px) {
      margin: 20px;
      padding: 20px;
      flex-direction: column;
    }

    .total-item {
      @media (max-width: 992px) {
        margin: 10px;
      }

      .prop {
        font-weight: 600;
        font-size: 20px;
        color: var(--color-text-secondary);
      }

      .value {
        font-weight: 600;
        font-size: 24px;
        color: var(--color-white);
        margin-top: 10px;
      }
    }
  }

  .table_header {
    padding: 20px 50px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    > div {
      color: var(--color-white);
      font-weight: bold;
      cursor: pointer;
      img {
        width: 16px;
        height: 16px;
        margin: 0 10px;
      }
    }
    @media (max-width: 992px) {
      .total-supply,
      .supply-apy,
      .total-borrow,
      .borrow-apy,
      .liquidity,
      .price {
        display: none;
      }
    }
  }
  .table_content {
    padding: 0 30px;
    .table_item {
      padding: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      &:hover {
        background-color: var(--color-bg-active);
        border-left: 2px solid var(--color-orange);
      }
      div {
        color: var(--color-white);
        max-width: 100%;
      }
      .mobile-label {
        display: none;
        @media (max-width: 992px) {
          font-weight: bold;
          display: block;
        }
      }
      .item-title {
        font-weight: 600;
        font-size: 16px;
        color: var(--color-white);
      }
      .item-value {
        font-weight: 600;
        font-size: 14px;
        color: var(--color-text-secondary);
      }
      .market {
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
`;

const format = commaNumber.bindWith(',', '.');

function Market({ history, settings }) {
  const [totalSupply, setTotalSupply] = useState('0');
  const [totalBorrow, setTotalBorrow] = useState('0');
  const [availableLiquidity, setAvailableLiquidity] = useState('0');
  const [sortInfo, setSortInfo] = useState({ field: '', sort: 'desc' });

  const getTotalInfo = async () => {
    const vaiContract = getVaiTokenContract();

    const tempTS = (settings.markets || []).reduce((accumulator, market) => {
      return new BigNumber(accumulator).plus(
        new BigNumber(market.totalSupplyUsd)
      );
    }, 0);
    const tempTB = (settings.markets || []).reduce((accumulator, market) => {
      return new BigNumber(accumulator).plus(
        new BigNumber(market.totalBorrowsUsd)
      );
    }, 0);
    const tempAL = (settings.markets || []).reduce((accumulator, market) => {
      return new BigNumber(accumulator).plus(new BigNumber(market.liquidity));
    }, 0);

    setTotalSupply(
      tempTS
        .plus(settings.vaultVaiStaked)
        .dp(2, 1)
        .toString(10)
    );
    setTotalBorrow(tempTB.dp(2, 1).toString(10));
    setAvailableLiquidity(
      tempAL
        .plus(settings.vaultVaiStaked)
        .dp(2, 1)
        .toString(10)
    );
  };

  useEffect(() => {
    if (settings.markets && settings.dailyVenus) {
      getTotalInfo();
    }
  }, [settings.markets]);

  const handleSort = field => {
    setSortInfo({
      field,
      sort:
        sortInfo.field === field && sortInfo.sort === 'desc' ? 'asc' : 'desc'
    });
  };

  return (
    <MainLayout title="All Markets">
      <MarketWrapper>
        <TableWrapper>
          <div className="total-info">
            <div className="total-item">
              <div className="prop">Total Supply</div>
              <div className="value">${format(totalSupply)}</div>
            </div>
            <div className="total-item">
              <div className="prop">Total Borrow</div>
              <div className="value">${format(totalBorrow)}</div>
            </div>
            <div className="total-item">
              <div className="prop">Available Liquidity</div>
              <div className="value">${format(availableLiquidity)}</div>
            </div>
          </div>
          {settings.vaiAPY && (
            <div className="vai-apy">VAI Staking APY: {settings.vaiAPY}%</div>
          )}
          <Row className="table_header">
            <Col xs={{ span: 24 }} lg={{ span: 2 }} className="market" />
            <Col
              xs={{ span: 6 }}
              lg={{ span: 4 }}
              className="total-supply right"
            >
              <span onClick={() => handleSort('total_supply')}>
                Total Supply{' '}
                {sortInfo.field === 'total_supply' && (
                  <Icon
                    type={sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'}
                  />
                )}
              </span>
            </Col>
            <Col xs={{ span: 6 }} lg={{ span: 3 }} className="supply-apy right">
              <span onClick={() => handleSort('supply_apy')}>
                Supply APY{' '}
                {sortInfo.field === 'supply_apy' && (
                  <Icon
                    type={sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'}
                  />
                )}
              </span>
            </Col>
            <Col
              xs={{ span: 6 }}
              lg={{ span: 4 }}
              className="total-borrow right"
            >
              <span onClick={() => handleSort('total_borrow')}>
                Total Borrow{' '}
                {sortInfo.field === 'total_borrow' && (
                  <Icon
                    type={sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'}
                  />
                )}
              </span>
            </Col>
            <Col xs={{ span: 6 }} lg={{ span: 3 }} className="borrow-apy right">
              <span onClick={() => handleSort('borrow_apy')}>
                Borrow APY{' '}
                {sortInfo.field === 'borrow_apy' && (
                  <Icon
                    type={sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'}
                  />
                )}
              </span>
            </Col>
            <Col xs={{ span: 6 }} lg={{ span: 4 }} className="liquidity right">
              <span onClick={() => handleSort('liquidity')}>
                Liquidity{' '}
                {sortInfo.field === 'liquidity' && (
                  <Icon
                    type={sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'}
                  />
                )}
              </span>
            </Col>
            <Col xs={{ span: 6 }} lg={{ span: 4 }} className="price right">
              <span onClick={() => handleSort('price')}>
                Price{' '}
                {sortInfo.field === 'price' && (
                  <Icon
                    type={sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'}
                  />
                )}
              </span>
            </Col>
          </Row>
          <div className="table_content">
            {settings.markets &&
              (settings.markets || [])
                .sort((a, b) => {
                  if (!sortInfo.field) {
                    return +new BigNumber(b.totalBorrowsUsd)
                      .minus(new BigNumber(a.totalBorrowsUsd))
                      .toString(10);
                  }
                  if (sortInfo.field === 'total_supply') {
                    return sortInfo.sort === 'desc'
                      ? +new BigNumber(b.totalSupplyUsd)
                          .minus(new BigNumber(a.totalSupplyUsd))
                          .toString(10)
                      : +new BigNumber(a.totalSupplyUsd)
                          .minus(new BigNumber(b.totalSupplyUsd))
                          .toString(10);
                  }
                  if (sortInfo.field === 'supply_apy') {
                    const aAPY = new BigNumber(a.supplyApy)
                      .plus(new BigNumber(a.supplyVenusApy))
                      .isLessThan(0.01)
                      ? '0.01'
                      : new BigNumber(a.supplyApy).plus(
                          new BigNumber(a.supplyVenusApy)
                        );
                    const bAPY = new BigNumber(b.supplyApy)
                      .plus(new BigNumber(b.supplyVenusApy))
                      .isLessThan(0.01)
                      ? '0.01'
                      : new BigNumber(b.supplyApy).plus(
                          new BigNumber(b.supplyVenusApy)
                        );
                    return sortInfo.sort === 'desc'
                      ? +bAPY.minus(aAPY).toString(10)
                      : +aAPY.minus(bAPY).toString(10);
                  }
                  if (sortInfo.field === 'total_borrow') {
                    return sortInfo.sort === 'desc'
                      ? +new BigNumber(b.totalBorrowsUsd)
                          .minus(new BigNumber(a.totalBorrowsUsd))
                          .toString(10)
                      : +new BigNumber(a.totalBorrowsUsd)
                          .minus(new BigNumber(b.totalBorrowsUsd))
                          .toString(10);
                  }
                  if (sortInfo.field === 'borrow_apy') {
                    const aAPY = new BigNumber(a.borrowApy)
                      .plus(new BigNumber(a.borrowVenusApy))
                      .isLessThan(0.01)
                      ? '0.01'
                      : new BigNumber(a.borrowApy).plus(
                          new BigNumber(a.borrowVenusApy)
                        );
                    const bAPY = new BigNumber(b.borrowApy)
                      .plus(new BigNumber(b.borrowVenusApy))
                      .isLessThan(0.01)
                      ? '0.01'
                      : new BigNumber(b.borrowApy).plus(
                          new BigNumber(b.borrowVenusApy)
                        );
                    return sortInfo.sort === 'desc'
                      ? +bAPY.minus(aAPY).toString(10)
                      : +aAPY.minus(bAPY).toString(10);
                  }
                  if (sortInfo.field === 'liquidity') {
                    return sortInfo.sort === 'desc'
                      ? +new BigNumber(b.liquidity)
                          .minus(new BigNumber(a.liquidity))
                          .toString(10)
                      : +new BigNumber(a.liquidity)
                          .minus(new BigNumber(b.liquidity))
                          .toString(10);
                  }
                  if (sortInfo.field === 'price') {
                    return sortInfo.sort === 'desc'
                      ? +new BigNumber(b.tokenPrice)
                          .minus(new BigNumber(a.tokenPrice))
                          .toString(10)
                      : +new BigNumber(a.tokenPrice)
                          .minus(new BigNumber(b.tokenPrice))
                          .toString(10);
                  }
                  return 0;
                })
                .map((item, index) => (
                  <Row
                    className="table_item pointer"
                    key={index}
                    onClick={() =>
                      history.push(`/market/${item.underlyingSymbol}`)
                    }
                  >
                    <Col
                      xs={{ span: 24 }}
                      lg={{ span: 2 }}
                      className="flex align-center market"
                    >
                      <img
                        className="asset-img"
                        src={
                          constants.CONTRACT_TOKEN_ADDRESS[
                            item.underlyingSymbol.toLowerCase()
                          ]
                            ? constants.CONTRACT_TOKEN_ADDRESS[
                                item.underlyingSymbol.toLowerCase()
                              ].asset
                            : null
                        }
                        alt="asset"
                      />
                      <p className="item-title">{item.underlyingSymbol}</p>
                    </Col>
                    <Col
                      xs={{ span: 24 }}
                      lg={{ span: 4 }}
                      className="total-supply right"
                    >
                      <p className="mobile-label">Total Supply</p>
                      <p className="item-title">
                        {currencyFormatter(item.totalSupplyUsd)}
                      </p>
                      <p className="item-value">
                        {format(
                          new BigNumber(item.totalSupplyUsd)
                            .div(new BigNumber(item.tokenPrice))
                            .dp(0, 1)
                            .toString(10)
                        )}{' '}
                        {item.underlyingSymbol}
                      </p>
                    </Col>
                    <Col
                      xs={{ span: 24 }}
                      lg={{ span: 3 }}
                      className="supply-apy right"
                    >
                      <p className="mobile-label">Supply APY</p>
                      <p className="item-title">
                        {new BigNumber(item.supplyApy)
                          .plus(new BigNumber(item.supplyVenusApy))
                          .isLessThan(0.01)
                          ? '0.01'
                          : new BigNumber(item.supplyApy)
                              .plus(new BigNumber(item.supplyVenusApy))
                              .dp(2, 1)
                              .toString(10)}
                        %
                      </p>
                      <p className="item-value">
                        {new BigNumber(item.supplyVenusApy)
                          .dp(2, 1)
                          .toString(10)}
                        %
                      </p>
                    </Col>
                    <Col
                      xs={{ span: 24 }}
                      lg={{ span: 4 }}
                      className="total-borrow right"
                    >
                      <p className="mobile-label">Total Borrow</p>
                      <p className="item-title">
                        {currencyFormatter(item.totalBorrowsUsd)}
                      </p>
                      <p className="item-value">
                        {format(
                          new BigNumber(item.totalBorrowsUsd)
                            .div(new BigNumber(item.tokenPrice))
                            .dp(0, 1)
                            .toString(10)
                        )}{' '}
                        {item.underlyingSymbol}
                      </p>
                    </Col>
                    <Col
                      xs={{ span: 24 }}
                      lg={{ span: 3 }}
                      className="borrow-apy right"
                    >
                      <p className="mobile-label">Borrow APY</p>
                      <p className="item-title">
                        {new BigNumber(item.borrowApy)
                          .plus(new BigNumber(item.borrowVenusApy))
                          .isLessThan(0.01)
                          ? '0.01'
                          : new BigNumber(item.borrowApy)
                              .plus(new BigNumber(item.borrowVenusApy))
                              .dp(2, 1)
                              .toString(10)}
                        %
                      </p>
                      <p className="item-value">
                        {new BigNumber(item.borrowVenusApy)
                          .dp(2, 1)
                          .toString(10)}
                        %
                      </p>
                    </Col>
                    <Col
                      xs={{ span: 24 }}
                      lg={{ span: 4 }}
                      className="liquidity right"
                    >
                      <p className="mobile-label">Liquidity</p>
                      <p className="item-title">
                        {currencyFormatter(item.liquidity)}
                      </p>
                    </Col>
                    <Col
                      xs={{ span: 24 }}
                      lg={{ span: 4 }}
                      className="price right"
                    >
                      <p className="mobile-label">Price</p>
                      <p className="item-title">
                        {currencyFormatter(item.tokenPrice)}
                      </p>
                      <p className="item-value" />
                    </Col>
                  </Row>
                ))}
          </div>
        </TableWrapper>
      </MarketWrapper>
    </MainLayout>
  );
}

Market.propTypes = {
  history: PropTypes.object,
  settings: PropTypes.object
};

Market.defaultProps = {
  history: {},
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(
  withRouter,
  connectAccount(mapStateToProps, undefined)
)(Market);
