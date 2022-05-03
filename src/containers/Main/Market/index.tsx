import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { Row, Col, Icon } from 'antd';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { uid } from 'react-uid';

import { getToken } from 'utilities';
import {
  currencyFormatter,
  formatToReadablePercentage,
  formatCommaThousandsPeriodDecimal,
  format,
} from 'utilities/common';
import { Setting, TokenId } from 'types';
import { useMarkets } from 'hooks/useMarkets';
import { State } from 'core/modules/initialState';

const TableWrapper = styled.div`
  position: relative;
  width: 100%;
  background: var(--color-bg-primary);
  border-radius: 8px;
  padding: 30px;
  margin: 0 auto;
  max-width: 1200px;

  @media (max-width: 768px) {
    padding: 16px;
  }

  .vai-apy {
    color: var(--color-green);
    font-size: 18px;
    margin-top: 20px;
    padding-bottom: 20px;
    font-weight: bold;
    border-bottom: 1px solid var(--color-bg-active);
  }

  .total-info {
    background: var(--color-bg-active);
    border-radius: 16px;
    padding: 20px;
    display: flex;

    @media (max-width: 1200px) {
      flex-direction: column;
    }

    .total-item {
      flex: 1;
      min-width: 0;

      &:not(:last-child) {
        margin-right: 10px;
      }

      @media (max-width: 1200px) {
        margin-right: 0;

        &:not(:last-child) {
          margin-bottom: 10px;
        }
      }

      .prop {
        font-weight: 600;
        color: var(--color-text-secondary);
      }

      .value {
        font-weight: 600;
        font-size: 20px;
        color: var(--color-white);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .table_header {
    padding: 20px;
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
    .table_item {
      padding: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);

      &:hover {
        background-color: var(--color-bg-active);
        border-left: 2px solid var(--color-yellow);
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

        &.green {
          color: #9dd562;
        }

        &.red {
          color: #f9053e;
        }
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

interface MarketProps extends RouteComponentProps {
  settings: Setting;
}

function Market({ history, settings }: MarketProps) {
  const [totalSupply, setTotalSupply] = useState('0');
  const [totalBorrow, setTotalBorrow] = useState('0');
  const [availableLiquidity, setAvailableLiquidity] = useState('0');
  const [sortInfo, setSortInfo] = useState({ field: '', sort: 'desc' });
  const { markets, treasuryTotalUSDBalance } = useMarkets();

  const getTotalInfo = async () => {
    const tempTS = (markets || []).reduce(
      (accumulator, market) =>
        new BigNumber(accumulator).plus(new BigNumber(market.totalSupplyUsd)),
      new BigNumber(0),
    );
    const tempTB = (markets || []).reduce(
      (accumulator, market) =>
        new BigNumber(accumulator).plus(new BigNumber(market.totalBorrowsUsd)),
      new BigNumber(0),
    );
    const tempAL = (markets || []).reduce(
      (accumulator, market) => new BigNumber(accumulator).plus(new BigNumber(market.liquidity)),
      new BigNumber(0),
    );

    setTotalSupply(
      tempTS
        .plus(settings.vaultVaiStaked || new BigNumber(0))
        .dp(2, 1)
        .toString(10),
    );
    setTotalBorrow(tempTB.dp(2, 1).toString(10));
    setAvailableLiquidity(
      tempAL
        .plus(settings.vaultVaiStaked || new BigNumber(0))
        .dp(2, 1)
        .toString(10),
    );
  };

  useEffect(() => {
    if (markets) {
      getTotalInfo();
    }
  }, [markets]);

  const handleSort = (field: $TSFixMe) => {
    setSortInfo({
      field,
      sort: sortInfo.field === field && sortInfo.sort === 'desc' ? 'asc' : 'desc',
    });
  };

  return (
    <TableWrapper>
      <div className="total-info">
        <div className="total-item">
          <div className="prop">Total Supply</div>
          <div className="value" title={formatCommaThousandsPeriodDecimal(totalSupply)}>
            ${formatCommaThousandsPeriodDecimal(totalSupply)}
          </div>
        </div>
        <div className="total-item">
          <div className="prop">Total Borrow</div>
          <div className="value" title={formatCommaThousandsPeriodDecimal(totalBorrow)}>
            ${formatCommaThousandsPeriodDecimal(totalBorrow)}
          </div>
        </div>
        <div className="total-item">
          <div className="prop">Available Liquidity</div>
          <div className="value" title={formatCommaThousandsPeriodDecimal(availableLiquidity)}>
            ${formatCommaThousandsPeriodDecimal(availableLiquidity)}
          </div>
        </div>
        <div className="total-item">
          <div className="prop">Total Treasury</div>
          <div
            className="value"
            title={formatCommaThousandsPeriodDecimal(treasuryTotalUSDBalance.dp(2).toString())}
          >
            ${formatCommaThousandsPeriodDecimal(treasuryTotalUSDBalance.dp(2).toString())}
          </div>
        </div>
      </div>
      {settings.vaiAPY && <div className="vai-apy">VAI Staking APY: {settings.vaiAPY}%</div>}
      <Row className="table_header">
        <Col xs={{ span: 24 }} lg={{ span: 2 }} className="market" />
        <Col xs={{ span: 6 }} lg={{ span: 4 }} className="total-supply right">
          <span onClick={() => handleSort('total_supply')}>
            Total Supply{' '}
            {sortInfo.field === 'total_supply' && (
              <Icon type={sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'} />
            )}
          </span>
        </Col>
        <Col xs={{ span: 6 }} lg={{ span: 3 }} className="supply-apy right">
          <span onClick={() => handleSort('supply_apy')}>
            Supply APY{' '}
            {sortInfo.field === 'supply_apy' && (
              <Icon type={sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'} />
            )}
          </span>
        </Col>
        <Col xs={{ span: 6 }} lg={{ span: 4 }} className="total-borrow right">
          <span onClick={() => handleSort('total_borrow')}>
            Total Borrow{' '}
            {sortInfo.field === 'total_borrow' && (
              <Icon type={sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'} />
            )}
          </span>
        </Col>
        <Col xs={{ span: 6 }} lg={{ span: 3 }} className="borrow-apy right">
          <span onClick={() => handleSort('borrow_apy')}>
            Borrow APY{' '}
            {sortInfo.field === 'borrow_apy' && (
              <Icon type={sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'} />
            )}
          </span>
        </Col>
        <Col xs={{ span: 6 }} lg={{ span: 4 }} className="liquidity right">
          <span onClick={() => handleSort('liquidity')}>
            Liquidity{' '}
            {sortInfo.field === 'liquidity' && (
              <Icon type={sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'} />
            )}
          </span>
        </Col>
        <Col xs={{ span: 6 }} lg={{ span: 4 }} className="price right">
          <span onClick={() => handleSort('price')}>
            Price{' '}
            {sortInfo.field === 'price' && (
              <Icon type={sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'} />
            )}
          </span>
        </Col>
      </Row>
      <div className="table_content">
        {markets &&
          (markets || [])
            .map(market => ({
              ...market,
              totalSupplyApy: new BigNumber(market.supplyApy).plus(
                new BigNumber(market.supplyVenusApy),
              ),
              totalBorrowApy: new BigNumber(market.borrowVenusApy).plus(
                new BigNumber(market.borrowApy),
              ),
            }))
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
                return sortInfo.sort === 'desc'
                  ? b.totalSupplyApy.minus(a.totalSupplyApy).toNumber()
                  : a.totalSupplyApy.minus(b.totalSupplyApy).toNumber();
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
                return sortInfo.sort === 'desc'
                  ? b.totalBorrowApy.minus(a.totalBorrowApy).toNumber()
                  : a.totalBorrowApy.minus(b.totalBorrowApy).toNumber();
              }
              if (sortInfo.field === 'liquidity') {
                return sortInfo.sort === 'desc'
                  ? +new BigNumber(b.liquidity).minus(new BigNumber(a.liquidity)).toString(10)
                  : +new BigNumber(a.liquidity).minus(new BigNumber(b.liquidity)).toString(10);
              }
              if (sortInfo.field === 'price') {
                return sortInfo.sort === 'desc'
                  ? +new BigNumber(b.tokenPrice).minus(new BigNumber(a.tokenPrice)).toString(10)
                  : +new BigNumber(a.tokenPrice).minus(new BigNumber(b.tokenPrice)).toString(10);
              }
              return 0;
            })
            .map(item => (
              <Row
                className="table_item pointer"
                key={uid(item)}
                onClick={() => history.push(`/market/${item.underlyingSymbol}`)}
              >
                <Col xs={{ span: 24 }} lg={{ span: 2 }} className="flex align-center market">
                  <img
                    className="asset-img"
                    src={getToken(item.underlyingSymbol.toLowerCase() as TokenId)?.asset}
                    alt="asset"
                  />
                  <p className="item-title">{item.underlyingSymbol}</p>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 4 }} className="total-supply right">
                  <p className="mobile-label">Total Supply</p>
                  <p className="item-title">{currencyFormatter(item.totalSupplyUsd)}</p>
                  <p className="item-value">
                    {format(
                      new BigNumber(item.totalSupplyUsd).div(new BigNumber(item.tokenPrice)),
                      0,
                    )}{' '}
                    {item.underlyingSymbol}
                  </p>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 3 }} className="supply-apy right">
                  <p className="mobile-label">Supply APY</p>
                  <p className="item-title green">
                    {formatToReadablePercentage(item.totalSupplyApy)}
                  </p>
                  <p className="item-value">{formatToReadablePercentage(item.supplyVenusApy)}</p>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 4 }} className="total-borrow right">
                  <p className="mobile-label">Total Borrow</p>
                  <p className="item-title">{currencyFormatter(item.totalBorrowsUsd)}</p>
                  <p className="item-value">
                    {format(
                      new BigNumber(item.totalBorrowsUsd).div(new BigNumber(item.tokenPrice)),
                      0,
                    )}{' '}
                    {item.underlyingSymbol}
                  </p>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 3 }} className="borrow-apy right">
                  <p className="mobile-label">Borrow APY</p>
                  <p className={`item-title${item.totalBorrowApy.lt(0) ? ' red' : ' green'}`}>
                    {formatToReadablePercentage(item.totalBorrowApy)}
                  </p>
                  <p className="item-value">{formatToReadablePercentage(item.borrowVenusApy)}</p>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 4 }} className="liquidity right">
                  <p className="mobile-label">Liquidity</p>
                  <p className="item-title">{currencyFormatter(item.liquidity)}</p>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 4 }} className="price right">
                  <p className="mobile-label">Price</p>
                  <p className="item-title">{currencyFormatter(item.tokenPrice)}</p>
                  <p className="item-value" />
                </Col>
              </Row>
            ))}
      </div>
    </TableWrapper>
  );
}

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connect(mapStateToProps)(withRouter(Market));
