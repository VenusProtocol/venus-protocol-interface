import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Row, Col, Icon, Progress } from 'antd';
import styled from 'styled-components';
import { uid } from 'react-uid';
import { connectAccount } from 'core';
import coinImg from 'assets/img/coins/xvs.svg';
import vaiImg from 'assets/img/coins/vai.svg';
import { State } from 'core/modules/initialState';
import { Setting } from 'types';
import { useMarkets } from 'hooks/useMarkets';
import { useComptrollerContract, useTokenContract } from 'clients/contracts/hooks';
import { getToken, getContractAddress, generateBscScanUrl } from 'utilities';
import { formatCommaThousandsPeriodDecimal } from 'utilities/common';

const XVSLayout = styled.div`
  .main-content {
    align-items: center;
  }
`;
const XVSWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const XVSInfoWrapper = styled.div`
  width: 100%;
  padding: 20px 20px 20px 0;
  max-width: 1200px;

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: flex-start !important;
  }

  @media (max-width: 768px) {
    padding: 0 20px;
  }

  .xvs-info {
    img {
      width: 24px;
      height: 24px;
    }

    a {
      margin: 0 10px;
      color: var(--color-white);
      @media (max-width: 768px) {
        font-size: 11px;
        line-height: 11px;
      }
    }

    i {
      color: var(--color-white);
    }
  }

  .distribution-wrapper {
    @media (max-width: 992px) {
      width: 100%;
      align-items: flex-end;
      margin-top: 20px;
    }
    @media (max-width: 768px) {
      align-items: center;
    }
    .info-wrapper {
      @media (max-width: 992px) {
        max-width: 320px;
      }
      .info-item {
        .title {
          color: var(--color-text-secondary);
          font-size: 12px;
        }
        .value {
          color: var(--color-white);
          font-weight: bold;
          font-size: 20px;
        }
        &:not(:last-child) {
          margin-right: 30px;
        }
      }
    }
    .ant-progress {
      @media (max-width: 992px) {
        max-width: 320px;
      }
    }
  }
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

  @media (max-width: 768px) {
    width: 90%;
  }

  .header-title {
    padding: 20px;
    font-weight: 600;
    font-size: 20px;
    color: var(--color-white);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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
      .borrow-apy,
      .per-day,
      .supply-apy,
      .total-distributed {
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
        .vai-img {
          width: 26px;
          height: 26px;
          margin-right: 14px;
        }
      }
    }
  }
`;

interface XVSProps extends RouteComponentProps {
  settings: Setting;
}

function XVS({ settings }: XVSProps) {
  const [totalMarkets, setTotalMarkets] = useState([]);
  const [dailyDistribution, setDailyDistribution] = useState('0');
  const [totalDistributed, setTotalDistributed] = useState('0');
  const [remainAmount, setRemainAmount] = useState('0');
  const [sortInfo, setSortInfo] = useState({ field: '', sort: 'desc' });
  const { markets, dailyVenus } = useMarkets();
  const xvsTokenContract = useTokenContract('xvs');
  const comptrollerContract = useComptrollerContract();

  const mintedAmount = '23700000';

  const getXVSInfo = async () => {
    const tempMarkets = [];
    const sum = (markets || []).reduce(
      (accumulator, market) =>
        new BigNumber(accumulator).plus(new BigNumber(market.totalDistributed)),
      0,
    );

    // total info
    const fetchedVenusVAIVaultRate = await comptrollerContract.methods.venusVAIVaultRate().call();
    const venusVAIVaultRate = new BigNumber(fetchedVenusVAIVaultRate).div(1e18).times(20 * 60 * 24);
    const remainedAmount = await xvsTokenContract.methods
      .balanceOf(getContractAddress('comptroller'))
      .call();
    setDailyDistribution(
      new BigNumber(dailyVenus)
        .div(new BigNumber(10).pow(18))
        .plus(venusVAIVaultRate)
        .dp(2, 1)
        .toString(10),
    );
    setTotalDistributed(sum.toString(10));
    setRemainAmount(
      new BigNumber(remainedAmount).div(new BigNumber(10).pow(18)).dp(2, 1).toString(10),
    );
    for (let i = 0; i < markets.length; i += 1) {
      tempMarkets.push({
        underlyingSymbol: markets[i].underlyingSymbol,
        perDay: +new BigNumber(markets[i].supplierDailyVenus)
          .plus(new BigNumber(markets[i].borrowerDailyVenus))
          .div(new BigNumber(10).pow(18))
          .dp(2, 1)
          .toString(10),
        supplyAPY: +(new BigNumber(markets[i].supplyVenusApy).isLessThan(0.01)
          ? '0.01'
          : new BigNumber(markets[i].supplyVenusApy).dp(2, 1).toString(10)),
        borrowAPY: +(new BigNumber(markets[i].borrowVenusApy).isLessThan(0.01)
          ? '0.01'
          : new BigNumber(markets[i].borrowVenusApy).dp(2, 1).toString(10)),
      });
    }
    tempMarkets.push({
      underlyingSymbol: 'VAI',
      perDay: +venusVAIVaultRate.dp(2, 1).toString(10),
      supplyAPY: settings.vaiAPY || 0,
      borrowAPY: 0,
    });
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ underlyingSymbol: any; perDay... Remove this comment to see the full error message
    setTotalMarkets(tempMarkets);
  };

  useEffect(() => {
    if (markets) {
      getXVSInfo();
    }
  }, [markets]);

  const handleSort = (field: $TSFixMe) => {
    setSortInfo({
      field,
      sort: sortInfo.field === field && sortInfo.sort === 'desc' ? 'asc' : 'desc',
    });
  };

  return (
    <XVSLayout>
      <XVSWrapper>
        <XVSInfoWrapper className="flex align-center just-between">
          <div className="flex align-center xvs-info">
            <img src={coinImg} alt="xvs" />
            <a
              className="highlight"
              href={generateBscScanUrl('xvs')}
              target="_blank"
              rel="noreferrer"
            >
              {getToken('xvs').address}
            </a>
            <CopyToClipboard text={getToken('xvs').address} onCopy={() => {}}>
              <Icon className="pointer copy-btn" type="copy" />
            </CopyToClipboard>
          </div>
          <div className="flex flex-column distribution-wrapper">
            <div className="flex align-center just-around info-wrapper">
              <div className="info-item">
                <p className="title">Daily Distribution</p>
                <p className="value">{formatCommaThousandsPeriodDecimal(dailyDistribution)}</p>
              </div>
              {/* <div className="info-item">
                      <p className="title">Total Distributed</p>
                      <p className="value">{format(totalDistributed)}</p>
                    </div> */}
              <div className="info-item">
                <p className="title">Remaining</p>
                <p className="value">{formatCommaThousandsPeriodDecimal(remainAmount)}</p>
              </div>
            </div>
            <Progress
              percent={new BigNumber(totalDistributed)
                .dividedBy(new BigNumber(mintedAmount))
                .multipliedBy(100)
                .toNumber()}
              strokeColor="var(--color-green)"
              strokeWidth={7}
              showInfo={false}
            />
          </div>
        </XVSInfoWrapper>
        <TableWrapper>
          <p className="header-title">Market Distribution</p>
          <Row className="table_header">
            <Col xs={{ span: 24 }} lg={{ span: 6 }} className="market">
              Market
            </Col>
            <Col xs={{ span: 8 }} lg={{ span: 6 }} className="per-day right">
              <span onClick={() => handleSort('perDay')}>
                <img src={coinImg} alt="xvs" /> Per Day{' '}
                {sortInfo.field === 'perDay' && (
                  <Icon type={sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'} />
                )}
              </span>
            </Col>
            <Col xs={{ span: 8 }} lg={{ span: 6 }} className="supply-apy right">
              <span onClick={() => handleSort('supplyAPY')}>
                Supply
                <img src={coinImg} alt="xvs" />
                APY{' '}
                {sortInfo.field === 'supplyAPY' && (
                  <Icon type={sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'} />
                )}
              </span>
            </Col>
            <Col xs={{ span: 8 }} lg={{ span: 6 }} className="borrow-apy right">
              <span onClick={() => handleSort('borrowAPY')}>
                Borrow
                <img src={coinImg} alt="xvs" />
                APY{' '}
                {sortInfo.field === 'borrowAPY' && (
                  <Icon type={sortInfo.sort === 'desc' ? 'caret-down' : 'caret-up'} />
                )}
              </span>
            </Col>
            {/* <Col xs={{ span: 6 }} lg={{ span: 4 }} className="total-distributed right">
                    Total Distributed
                  </Col> */}
          </Row>
          <div className="table_content">
            {totalMarkets &&
              (totalMarkets || [])
                .sort((a, b) => {
                  if (sortInfo.field) {
                    if (sortInfo.field === 'perDay') {
                      return sortInfo.sort === 'desc'
                        ? // @ts-expect-error ts-migrate(2339) FIXME: Property 'perDay' does not exist on type 'never'.
                          +new BigNumber(b.perDay)
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'perDay' does not exist on type 'never'.
                            .minus(new BigNumber(a.perDay))
                            .toString(10)
                        : // @ts-expect-error ts-migrate(2339) FIXME: Property 'perDay' does not exist on type 'never'.
                          +new BigNumber(a.perDay)
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'perDay' does not exist on type 'never'.
                            .minus(new BigNumber(b.perDay))
                            .toString(10);
                    }
                    if (sortInfo.field === 'supplyAPY') {
                      return sortInfo.sort === 'desc'
                        ? // @ts-expect-error ts-migrate(2339) FIXME: Property 'supplyAPY' does not exist on type 'never... Remove this comment to see the full error message
                          +new BigNumber(b.supplyAPY)
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'supplyAPY' does not exist on type 'never... Remove this comment to see the full error message
                            .minus(new BigNumber(a.supplyAPY))
                            .toString(10)
                        : // @ts-expect-error ts-migrate(2339) FIXME: Property 'supplyAPY' does not exist on type 'never... Remove this comment to see the full error message
                          +new BigNumber(a.supplyAPY)
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'supplyAPY' does not exist on type 'never... Remove this comment to see the full error message
                            .minus(new BigNumber(b.supplyAPY))
                            .toString(10);
                    }
                    if (sortInfo.field === 'borrowAPY') {
                      return sortInfo.sort === 'desc'
                        ? // @ts-expect-error ts-migrate(2339) FIXME: Property 'borrowAPY' does not exist on type 'never... Remove this comment to see the full error message
                          +new BigNumber(b.borrowAPY)
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'borrowAPY' does not exist on type 'never... Remove this comment to see the full error message
                            .minus(new BigNumber(a.borrowAPY))
                            .toString(10)
                        : // @ts-expect-error ts-migrate(2339) FIXME: Property 'borrowAPY' does not exist on type 'never... Remove this comment to see the full error message
                          +new BigNumber(a.borrowAPY)
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'borrowAPY' does not exist on type 'never... Remove this comment to see the full error message
                            .minus(new BigNumber(b.borrowAPY))
                            .toString(10);
                    }
                  }
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'perDay' does not exist on type 'never'.
                  return +new BigNumber(b.perDay)
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'perDay' does not exist on type 'never'.
                    .minus(new BigNumber(a.perDay))
                    .toString(10);
                })
                .map(item => (
                  <Row className="table_item pointer" key={uid(item)}>
                    <Col xs={{ span: 24 }} lg={{ span: 6 }} className="flex align-center market">
                      {/*  @ts-expect-error ts-migrate(2339) FIXME: Property 'underlyingSymbol' does not exist on type... Remove this comment to see the full error message */}
                      {item.underlyingSymbol !== 'VAI' ? (
                        <img
                          className="asset-img"
                          src={
                            getToken(
                              // @ts-expect-error ts-migrate(2339) FIXME: Property 'underlyingSymbol' does not exist on type... Remove this comment to see the full error message
                              item.underlyingSymbol.toLowerCase(),
                            ).asset
                          }
                          alt="asset"
                        />
                      ) : (
                        <img className="vai-img" src={vaiImg} alt="asset" />
                      )}
                      {/*  @ts-expect-error ts-migrate(2339) FIXME: Property 'underlyingSymbol' does not exist on type... Remove this comment to see the full error message */}
                      <p>{item.underlyingSymbol}</p>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 6 }} className="per-day right">
                      <p className="mobile-label">Per day</p>
                      {/*  @ts-expect-error ts-migrate(2339) FIXME: Property 'perDay' does not exist on type 'never'. */}
                      <p>{item.perDay}</p>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 6 }} className="supply-apy right">
                      <p className="mobile-label">Supply APY</p>
                      <p>
                        {/*  @ts-expect-error ts-migrate(2339) FIXME: Property 'supplyAPY' does not exist on type 'never... Remove this comment to see the full error message */}
                        {item.supplyAPY}%
                      </p>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 6 }} className="borrow-apy right">
                      <p className="mobile-label">Borrow APY</p>
                      {/*  @ts-expect-error ts-migrate(2339) FIXME: Property 'underlyingSymbol' does not exist on type... Remove this comment to see the full error message */}
                      {item.underlyingSymbol !== 'VAI' ? (
                        <p>
                          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'borrowAPY' does not exist on type 'never... Remove this comment to see the full error message */}
                          {item.borrowAPY}%
                        </p>
                      ) : (
                        <p>-</p>
                      )}
                    </Col>
                  </Row>
                ))}
          </div>
        </TableWrapper>
      </XVSWrapper>
    </XVSLayout>
  );
}

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connectAccount(mapStateToProps)(withRouter(XVS));
