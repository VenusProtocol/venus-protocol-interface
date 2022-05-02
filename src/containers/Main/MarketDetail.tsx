/* eslint-disable no-useless-escape */
import React, { useEffect, useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { connectAccount } from 'core';

import { promisify, getVBepToken } from 'utilities';
import OverviewChart from 'components/Basic/OverviewChart';
import MarketInfo from 'components/MarketDetail/MarketInfo';
import MarketSummary from 'components/MarketDetail/MarketSummary';
import InterestRateModel from 'components/MarketDetail/InterestRateModel';
import { Setting, VTokenId } from 'types';
import { State } from 'core/modules/initialState';
import { useMarkets } from 'hooks/useMarkets';
import { AuthContext } from 'context/AuthContext';

const MarketDetailWrapper = styled.div`
  height: 100%;

  .market-detail-content {
    width: 100%;

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
        margin-right: 0;
        margin-bottom: 20px;
      }
    }

    .column2 {
      width: calc(100% - 440px);
      height: 100%;
      margin-left: 10px;
      @media only screen and (max-width: 1440px) {
        width: 100%;
        margin-left: 0;
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
            margin-right: 0;
            margin-bottom: 20px;
          }
        }
        .market-summary {
          flex: 1;
          margin-left: 10px;
          @media only screen and (max-width: 768px) {
            margin-left: 0;
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

interface Props extends RouteComponentProps<{ asset: VTokenId }> {
  settings: Setting;
  getMarketHistory: $TSFixMe;
}

function MarketDetail({ match, getMarketHistory }: Props) {
  const [marketType, setMarketType] = useState('supply');
  const [currentAsset, setCurrentAsset] = useState<VTokenId | ''>('');
  const [data, setData] = useState([]);
  const [marketInfo, setMarketInfo] = useState({});
  // const [currentAPY, setCurrentAPY] = useState(0);
  const { account } = useContext(AuthContext);
  const { markets } = useMarkets();

  useEffect(() => {
    if (match.params && match.params.asset) {
      setCurrentAsset(match.params.asset.toLowerCase() as VTokenId);
    }
  }, [match]);

  const getGraphData = useCallback(
    async (asset, type, limit) => {
      const tempData: $TSFixMe = [];
      await promisify(getMarketHistory, { asset, type, limit }).then(res => {
        // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
        res.data.result.forEach((m: $TSFixMe) => {
          tempData.push({
            createdAt: m.createdAt,
            supplyApy: +new BigNumber(m.supplyApy || 0).dp(8, 1).toString(10),
            borrowApy: +new BigNumber(m.borrowApy || 0).dp(8, 1).toString(10),
            totalSupply: +new BigNumber(m.totalSupply || 0).dp(8, 1).toString(10),
            totalBorrow: +new BigNumber(m.totalBorrow || 0).dp(8, 1).toString(10),
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
      const info = markets.find(item => item.underlyingSymbol.toLowerCase() === currentAsset);
      setMarketInfo(info || {});
    }
  }, [markets, currentAsset]);

  useEffect(() => {
    getGovernanceData();
  }, [getGovernanceData]);

  useEffect(() => {
    if (timeStamp % 60 === 0 && currentAsset) {
      getGraphData(
        getVBepToken(currentAsset as VTokenId).address,
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
        getVBepToken(currentAsset as VTokenId).address,
        '1day',
        30, // 1 month
      );
    }
  }, [currentAsset]);

  return (
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
                    className={`tab-item pointer ${marketType === 'supply' ? 'tab-active' : ''}`}
                    onClick={() => setMarketType('supply')}
                  >
                    Supply
                  </div>
                  <div
                    className={`tab-item pointer ${marketType === 'borrow' ? 'tab-active' : ''}`}
                    onClick={() => setMarketType('borrow')}
                  >
                    Borrow
                  </div>
                </div>
                <OverviewChart marketType={marketType} graphType="composed" data={data} />
              </CardWrapper>
            </div>
            <div className="flex row2">
              <CardWrapper className="interest-rate-modal">
                <InterestRateModel currentAsset={currentAsset} />
              </CardWrapper>
              <CardWrapper className="market-summary">
                <MarketSummary marketInfo={marketInfo} currentAsset={currentAsset} />
              </CardWrapper>
            </div>
          </div>
        </div>
      )}
    </MarketDetailWrapper>
  );
}

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connectAccount(mapStateToProps)(withRouter(MarketDetail));
