/* eslint-disable no-useless-escape */
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import BigNumber from 'bignumber.js';
import MainLayout from 'containers/Layout/MainLayout';
import { connectAccount, accountActionCreators } from 'core';
import { promisify } from 'utilities';
import * as constants from 'utilities/constants';
import OverviewChart from 'components/Basic/OverviewChart';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import MarketInfo from 'components/MarketDetail/MarketInfo';
import MarketSummary from 'components/MarketDetail/MarketSummary';
import InterestRateModel from 'components/MarketDetail/InterestRateModel';
// import { getBigNumber } from 'utilities/common';

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

const SpinnerWrapper = styled.div`
  height: 85vh;
  width: 100%;

  @media only screen and (max-width: 1440px) {
    height: 70vh;
  }
`;

let timeStamp = 0;
const abortController = new AbortController();

function MarketDetail({ match, settings, getMarketHistory }) {
  const [marketType, setMarketType] = useState('supply');
  const [currentAsset, setCurrentAsset] = useState('');
  const [data, setData] = useState([]);
  const [marketInfo, setMarketInfo] = useState({});
  // const [currentAPY, setCurrentAPY] = useState(0);

  useEffect(() => {
    if (match.params && match.params.asset) {
      setCurrentAsset(match.params.asset.toLowerCase());
    }
  }, [match]);

  const getGraphData = useCallback(
    async (asset, type, limit) => {
      const tempData = [];
      await promisify(getMarketHistory, { asset, type, limit }).then(res => {
        res.data.result.forEach(m => {
          tempData.push({
            createdAt: m.createdAt,
            supplyApy: +new BigNumber(m.supplyApy || 0).dp(8, 1).toString(10),
            borrowApy: +new BigNumber(m.borrowApy || 0).dp(8, 1).toString(10),
            totalSupply: +new BigNumber(m.totalSupply || 0)
              .dp(8, 1)
              .toString(10),
            totalBorrow: +new BigNumber(m.totalBorrow || 0)
              .dp(8, 1)
              .toString(10)
          });
        });
        setData([...tempData.reverse()]);
      });
    },
    [getMarketHistory]
  );

  const getGovernanceData = useCallback(async () => {
    if (settings.markets && settings.markets.length > 0 && currentAsset) {
      const info = settings.markets.find(
        item => item.underlyingSymbol.toLowerCase() === currentAsset
      );
      setMarketInfo(info || {});
    }
  }, [settings.markets, currentAsset]);

  useEffect(() => {
    getGovernanceData();
  }, [getGovernanceData]);

  useEffect(() => {
    if (timeStamp % 60 === 0 && currentAsset) {
      getGraphData(
        constants.CONTRACT_VBEP_ADDRESS[currentAsset].address,
        '1day',
        30 // 1 month
      );
    }
    timeStamp = Date.now();
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.selectedAddress, currentAsset, getGraphData]);

  useEffect(() => {
    if (currentAsset) {
      getGraphData(
        constants.CONTRACT_VBEP_ADDRESS[currentAsset].address,
        '1day',
        30 // 1 month
      );
    }
  }, [currentAsset]);

  return (
    <MainLayout title="Market">
      <MarketDetailWrapper className="flex">
        {(!settings.selectedAddress ||
          !settings.markets ||
          !currentAsset ||
          settings.accountLoading ||
          settings.wrongNetwork) && (
          <SpinnerWrapper>
            <LoadingSpinner />
          </SpinnerWrapper>
        )}
        {settings.selectedAddress &&
          settings.markets &&
          settings.decimals &&
          currentAsset &&
          !settings.accountLoading &&
          !settings.wrongNetwork && (
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
                        className={`tab-item pointer ${
                          marketType === 'supply' ? 'tab-active' : ''
                        }`}
                        onClick={() => setMarketType('supply')}
                      >
                        Supply
                      </div>
                      <div
                        className={`tab-item pointer ${
                          marketType === 'borrow' ? 'tab-active' : ''
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

MarketDetail.propTypes = {
  match: PropTypes.object,
  settings: PropTypes.object,
  getMarketHistory: PropTypes.func.isRequired
};

MarketDetail.defaultProps = {
  match: {},
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { getMarketHistory } = accountActionCreators;

  return bindActionCreators(
    {
      getMarketHistory
    },
    dispatch
  );
};

export default compose(
  withRouter,
  connectAccount(mapStateToProps, mapDispatchToProps)
)(MarketDetail);
