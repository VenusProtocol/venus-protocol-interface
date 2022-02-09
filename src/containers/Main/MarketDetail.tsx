/* eslint-disable no-useless-escape */
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { compose } from 'recompose';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import BigNumber from 'bignumber.js';
import MainLayout from 'containers/Layout/MainLayout';
import { connectAccount, accountActionCreators } from 'core';
import { promisify } from 'utilities';
import * as constants from 'utilities/constants';
import OverviewChart from 'components/Basic/OverviewChart';
import MarketInfo from 'components/MarketDetail/MarketInfo';
import MarketSummary from 'components/MarketDetail/MarketSummary';
import InterestRateModel from 'components/MarketDetail/InterestRateModel';
import { useWeb3React } from '@web3-react/core';
import { useMarkets } from '../../hooks/useMarkets';

const MarketDetailWrapper = styled.div`
  height: 100%;

  .market-detail-content {
    width: 100%;
    padding: 20px 40px 20px 0px;

    @media only screen and (max-width: 1440px) {
      flex-direction: column;
    }
    @media only screen and (max-width: 768px) {
      padding: 20px;
    }
    .column1 {
      width: 440px;
      min-width: 440px;
      height: 100%;
      margin-right: 10px;
      @media only screen and (max-width: 1440px) {
        width: 100%;
        min-width: unset;
        margin-right: 0px;
        margin-bottom: 20px;
      }
    }

    .column2 {
      width: calc(100% - 440px);
      height: 100%;
      margin-left: 10px;
      @media only screen and (max-width: 1440px) {
        width: 100%;
        margin-left: 0px;
      }
      .row1 {
        margin-bottom: 20px;
        .market-tab-wrapper {
          margin-bottom: 25px;
          .tab-item {
            font-size: 17px;
            font-weight: 900;
            color: #86868a;
            &:not(:last-child) {
              margin-right: 54px;
            }
          }
          .tab-active {
            color: var(--color-text-main);
          }
        }
      }
      .row2 {
        @media only screen and (max-width: 768px) {
          flex-direction: column;
        }
        .interest-rate-modal {
          flex: 1;
          margin-right: 10px;
          @media only screen and (max-width: 768px) {
            margin-right: 0px;
            margin-bottom: 20px;
          }
        }
        .market-summary {
          flex: 1;
          margin-left: 10px;
          @media only screen and (max-width: 768px) {
            margin-left: 0px;
          }
        }
      }
    }
  }
`;

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: var(--color-bg-primary);
  padding: 25px 32px;
`;

let timeStamp = 0;
const abortController = new AbortController();

interface Props extends RouteComponentProps<{ asset: string }> {
  settings: object,
  getMarketHistory: () => void,
}

function MarketDetail({ match, getMarketHistory }: Props) {
  const [marketType, setMarketType] = useState('supply');
  const [currentAsset, setCurrentAsset] = useState('');
  const [data, setData] = useState([]);
  const [marketInfo, setMarketInfo] = useState({});
  // const [currentAPY, setCurrentAPY] = useState(0);
  const { account } = useWeb3React();
  const { markets } = useMarkets();

  useEffect(() => {
    if (match.params && match.params.asset) {
      setCurrentAsset(match.params.asset.toLowerCase());
    }
  }, [match]);

  const getGraphData = useCallback(
    async (asset, type, limit) => {
      const tempData: $TSFixMe = [];
      await promisify(getMarketHistory, { asset, type, limit }).then((res) => {
        // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
        res.data.result.forEach((m: $TSFixMe) => {
          tempData.push({
            createdAt: m.createdAt,
            supplyApy: +new BigNumber(m.supplyApy || 0).dp(8, 1).toString(10),
            borrowApy: +new BigNumber(m.borrowApy || 0).dp(8, 1).toString(10),
            totalSupply: +new BigNumber(m.totalSupply || 0)
              .dp(8, 1)
              .toString(10),
            totalBorrow: +new BigNumber(m.totalBorrow || 0)
              .dp(8, 1)
              .toString(10),
          });
        });
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
        setData([...tempData.reverse()]);
      });
    },
    [getMarketHistory],
  );

  const getGovernanceData = useCallback(async () => {
    if (markets && markets.length > 0 && currentAsset) {
      const info = markets.find(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'underlyingSymbol' does not exist on type... Remove this comment to see the full error message
        item => item.underlyingSymbol.toLowerCase() === currentAsset,
      );
      setMarketInfo(info || {});
    }
  }, [markets, currentAsset]);

  useEffect(() => {
    getGovernanceData();
  }, [getGovernanceData]);

  useEffect(() => {
    if (timeStamp % 60 === 0 && currentAsset) {
      getGraphData(
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        constants.CONTRACT_VBEP_ADDRESS[currentAsset].address,
        '1day',
        30, // 1 month
      );
    }
    timeStamp = Date.now();
    return function cleanup() {
      abortController.abort();
    };
  }, [account, currentAsset, getGraphData]);

  useEffect(() => {
    if (currentAsset) {
      getGraphData(
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        constants.CONTRACT_VBEP_ADDRESS[currentAsset].address,
        '1day',
        30, // 1 month
      );
    }
  }, [currentAsset]);

  return (
    <MainLayout title="Market">
      <MarketDetailWrapper className="flex">
        {currentAsset && (
          <div className="flex market-detail-content">
            <div className="column1">
              <CardWrapper>
                <MarketInfo marketInfo={marketInfo} marketType={marketType} />
              </CardWrapper>
            </div>
            <div className="column2">
              <div className="row1">
                <CardWrapper>
                  <div className="flex align-center market-tab-wrapper">
                    <div
                      className={`tab-item pointer ${marketType === 'supply' ? 'tab-active' : ''
                      }`}
                      onClick={() => setMarketType('supply')}
                    >
                      Supply
                    </div>
                    <div
                      className={`tab-item pointer ${marketType === 'borrow' ? 'tab-active' : ''
                      }`}
                      onClick={() => setMarketType('borrow')}
                    >
                      Borrow
                    </div>
                  </div>
                  <OverviewChart
                    marketType={marketType}
                    graphType="composed"
                    data={data}
                  />
                </CardWrapper>
              </div>
              <div className="flex row2">
                <CardWrapper className="interest-rate-modal">
                  <InterestRateModel currentAsset={currentAsset} />
                </CardWrapper>
                <CardWrapper className="market-summary">
                  <MarketSummary
                    marketInfo={marketInfo}
                    currentAsset={currentAsset}
                  />
                </CardWrapper>
              </div>
            </div>
          </div>
        )}
      </MarketDetailWrapper>
    </MainLayout>
  );
}

MarketDetail.defaultProps = {
  settings: {},
};

const mapStateToProps = ({ account }: $TSFixMe) => ({
  settings: account.setting,
});

const mapDispatchToProps = (dispatch: $TSFixMe) => {
  const { getMarketHistory } = accountActionCreators;

  return bindActionCreators(
    {
      getMarketHistory,
    },
    dispatch,
  );
};

export default compose<Props, Props>(
  withRouter,
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 0-1 arguments, but got 2.
  connectAccount(mapStateToProps, mapDispatchToProps),
)(MarketDetail);
