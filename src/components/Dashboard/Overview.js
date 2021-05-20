import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import BigNumber from 'bignumber.js';
import { bindActionCreators } from 'redux';
import { Select, Icon } from 'antd';
import { connectAccount, accountActionCreators } from 'core';
import OverviewChart from 'components/Basic/OverviewChart';
import { promisify } from 'utilities';
import * as constants from 'utilities/constants';
import commaNumber from 'comma-number';
import { addToken, getBigNumber } from 'utilities/common';
import { Card } from 'components/Basic/Card';

const CardWrapper = styled.div`
  width: 100%;
  border-radius: 25px;
  background-color: #181c3a;
  padding: 28px 25px 27px 25px;

  .asset-img {
    width: 28px;
    height: 28px;
    margin-right: 13px;
  }

  .label {
    font-size: 16px;
    font-weight: normal;
    color: var(--color-text-secondary);
  }

  .historic-label {
    font-size: 16px;
    font-weight: normal;
    color: var(--color-text-secondary);
    margin: 10px 41px 0;
  }

  .value {
    font-size: 17px;
    font-weight: 900;
    color: var(--color-text-main);
  }

  .apy-label {
    text-align: right;
    font-size: 16px;
    font-weight: normal;
    color: var(--color-text-secondary);
  }

  .apy-value {
    text-align: right;
    font-size: 19px;
    font-weight: 900;
    color: var(--color-text-green);
  }

  .apy-value-red {
    text-align: right;
    font-size: 19px;
    font-weight: 900;
    color: var(--color-text-red);
  }

  .description {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media only screen and (max-width: 768px) {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: 10px;
    }
  }

  .asset-select-wrapper {
    width: 100%;

    @media only screen and (max-width: 1496px) {
      flex-direction: column;
      align-items: flex-start;
    }
    .add-token-wrapper {
      margin-left: 20px;
      color: var(--color-white);

      @media only screen and (max-width: 1496px) {
        width: 100%;
        margin-left: 0px;
        margin-top: 10px;
        justify-content: flex-end;
      }

      .add-token {
        font-size: 18px;
        color: var(--color-green);
        margin-left: 10px;
      }

      .underlying-asset,
      .vtoken-asset {
        margin-right: 20px;
      }

      .destination {
        color: var(--color-white);
      }
    }
  }
`;

const AssetSelectWrapper = styled.div`
  position: relative;
  .ant-select {
    .ant-select-selection {
      background-color: transparent;
      border: none;
      color: var(--color-text-main);
      font-size: 17px;
      font-weight: 900;
      color: var(--color-text-main);
      margin-top: 4px;
      i {
        color: var(--color-text-main);
      }
    }
  }
`;

const { Option } = Select;
const abortController = new AbortController();
const format = commaNumber.bindWith(',', '.');

function Overview({ settings, getMarketHistory }) {
  const [currentAsset, setCurrentAsset] = useState(null);
  const [data, setData] = useState([]);
  const [marketInfo, setMarketInfo] = useState({});
  const [currentAPY, setCurrentAPY] = useState(0);
  const getGraphData = async (asset, type, limit) => {
    let tempData = [];
    const res = await promisify(getMarketHistory, { asset, type, limit });
    tempData = res.data.result
      .map(m => {
        return {
          createdAt: m.createdAt,
          supplyApy: +new BigNumber(m.supplyApy || 0).dp(8, 1).toString(10),
          borrowApy: +new BigNumber(m.borrowApy || 0).dp(8, 1).toString(10)
        };
      })
      .reverse();
    setData([...tempData]);
  };

  const getGovernanceData = useCallback(async () => {
    if (!currentAsset) return;
    if (settings.markets && settings.markets.length > 0) {
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
    if (currentAsset) {
      getGraphData(
        constants.CONTRACT_VBEP_ADDRESS[currentAsset].address,
        process.env.REACT_APP_GRAPH_TICKER || null,
        24 * 7 // 1 week
      );
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.selectedAddress, currentAsset]);

  useEffect(() => {
    setCurrentAsset('sxp');
  }, []);

  useEffect(() => {
    if (settings.assetList && settings.assetList.length > 0) {
      const currentMarketInfo =
        settings.assetList.filter(s => s.id === currentAsset).length !== 0
          ? settings.assetList.filter(s => s.id === currentAsset)[0]
          : {};
      const supplyApy = getBigNumber(currentMarketInfo.supplyApy);
      const borrowApy = getBigNumber(currentMarketInfo.borrowApy);
      const supplyApyWithXVS = settings.withXVS
        ? supplyApy.plus(currentMarketInfo.xvsSupplyApy)
        : supplyApy;
      const borrowApyWithXVS = settings.withXVS
        ? getBigNumber(currentMarketInfo.xvsBorrowApy).minus(borrowApy)
        : borrowApy;
      setCurrentAPY(
        (settings.marketType || 'supply') === 'supply'
          ? supplyApyWithXVS.dp(2, 1).toString(10)
          : borrowApyWithXVS.dp(2, 1).toString(10)
      );
    }
  }, [currentAsset, settings.marketType, settings.assetList, settings.withXVS]);

  const handleChangeAsset = value => {
    setCurrentAsset(value);
  };

  if (!settings.decimals[currentAsset]) {
    return null;
  }

  return (
    <Card>
      <CardWrapper>
        <div className="flex align-center just-between">
          <div className="flex align-center just-between asset-select-wrapper">
            <AssetSelectWrapper
              className="flex align-center just-end"
              id="asset"
            >
              <Select
                defaultValue="sxp"
                style={{ width: 150, marginRight: 10 }}
                getPopupContainer={() => document.getElementById('asset')}
                dropdownMenuStyle={{
                  backgroundColor: '#090d27'
                }}
                dropdownClassName="asset-select"
                onChange={handleChangeAsset}
              >
                {Object.keys(constants.CONTRACT_VBEP_ADDRESS).map(
                  (key, index) => (
                    <Option
                      className="flex align-center just-between"
                      value={constants.CONTRACT_VBEP_ADDRESS[key].id}
                      key={index}
                    >
                      <img
                        className="asset-img"
                        src={constants.CONTRACT_TOKEN_ADDRESS[key].asset}
                        alt="asset"
                      />{' '}
                      <span>
                        {constants.CONTRACT_TOKEN_ADDRESS[key].symbol}
                      </span>
                    </Option>
                  )
                )}
              </Select>
              <div className="value">Overview</div>
            </AssetSelectWrapper>
            {window.ethereum && window.ethereum.networkVersion && (
              <div className="flex align-center add-token-wrapper">
                {currentAsset !== 'bnb' && (
                  <div className="flex align-center underlying-asset">
                    {currentAsset.toUpperCase()}
                    <Icon
                      className="add-token"
                      type="plus-circle"
                      theme="filled"
                      onClick={() =>
                        addToken(
                          currentAsset,
                          settings.decimals[currentAsset].token,
                          'token'
                        )
                      }
                    />
                  </div>
                )}
                <div className="flex align-center vtoken-asset">
                  {`v${
                    currentAsset === 'btcb' ? 'BTC' : currentAsset.toUpperCase()
                  }`}
                  <Icon
                    className="add-token"
                    type="plus-circle"
                    theme="filled"
                    onClick={() =>
                      addToken(
                        currentAsset,
                        settings.decimals[currentAsset].vtoken,
                        'vtoken'
                      )
                    }
                  />
                </div>
                <p className="destination">To MetaMask</p>
              </div>
            )}
          </div>
          {/* <p className="value">{`$${
              (settings.marketType || 'supply') === 'supply'
                ? new BigNumber(marketInfo.totalSupply || 0).div(new BigNumber(10).pow(settings.decimals[currentAsset].vtoken)).dp(2, 1).toString(10)
                : new BigNumber(marketInfo.totalBorrows || 0).div(new BigNumber(10).pow(settings.decimals[currentAsset].token)).dp(2, 1).toString(10)
            }`}
          </p> */}
        </div>
        <div className="historic-label">Historical rates</div>
        <div className="flex flex-column flex-end">
          <p className={(settings.marketType || 'supply') === 'supply' || currentAPY >= 0  ? "apy-value" : "apy-value-red"}>
            {currentAPY}%
          </p>
          <p className="apy-label">
            {(settings.marketType || 'supply') === 'supply'
              ? 'Supply APY'
              : 'Borrow APY'}
          </p>
        </div>
        <OverviewChart
          marketType={settings.marketType || 'supply'}
          data={data}
        />
        <div className="description">
          <p className="label">Price</p>
          <p className="value">
            {`$${new BigNumber(marketInfo.underlyingPrice || 0)
              .div(
                new BigNumber(10).pow(
                  18 + 18 - parseInt(settings.decimals[currentAsset].token, 10)
                )
              )
              .dp(8, 1)
              .toString(10)}`}
          </p>
        </div>
        <div className="description">
          <p className="label">Market Liquidity</p>
          <p className="value">
            {`${format(
              new BigNumber(marketInfo.cash || 0)
                .div(
                  new BigNumber(10).pow(settings.decimals[currentAsset].token)
                )
                .dp(8, 1)
                .toString(10)
            )} ${marketInfo.underlyingSymbol || ''}`}
          </p>
        </div>
        <div className="description">
          <p className="label"># of Suppliers</p>
          <p className="value">{format(marketInfo.supplierCount)}</p>
        </div>
        <div className="description">
          <p className="label"># of Borrowers</p>
          <p className="value">{format(marketInfo.borrowerCount)}</p>
        </div>
        <div className="description">
          <p className="label">Reserves</p>
          <p className="value">
            {`${new BigNumber(marketInfo.totalReserves || 0)
              .div(new BigNumber(10).pow(settings.decimals[currentAsset].token))
              .dp(8, 1)
              .toString(10)} ${marketInfo.underlyingSymbol || ''}`}
          </p>
        </div>
        <div className="description">
          <p className="label">Reserve Factor</p>
          <p className="value">
            {`${new BigNumber(marketInfo.reserveFactor || 0)
              .div(new BigNumber(10).pow(18))
              .multipliedBy(100)
              .dp(8, 1)
              .toString(10)}%`}
          </p>
        </div>
        <div className="description">
          <p className="label">Collateral Factor</p>
          <p className="value">
            {`${new BigNumber(marketInfo.collateralFactor || 0)
              .div(new BigNumber(10).pow(18))
              .times(100)
              .dp(2, 1)
              .toString(10)}%`}
          </p>
        </div>
        <div className="description">
          <p className="label">Total Supply</p>
          <p className="value">
            {`$${format(
              new BigNumber(marketInfo.totalSupplyUsd || 0)
                .dp(2, 1)
                .toString(10)
            )}`}
          </p>
        </div>
        <div className="description">
          <p className="label">Total Borrow</p>
          <p className="value">
            {`$${format(
              new BigNumber(marketInfo.totalBorrowsUsd || 0)
                .dp(2, 1)
                .toString(10)
            )}`}
          </p>
        </div>
        <div className="description">
          <p className="label">Exchange Rate</p>
          <p className="value">
            {`1 ${marketInfo.underlyingSymbol || ''} = ${Number(
              new BigNumber(1)
                .div(
                  new BigNumber(marketInfo.exchangeRate).div(
                    new BigNumber(10).pow(
                      18 +
                        +parseInt(
                          settings.decimals[currentAsset || 'sxp'].token,
                          10
                        ) -
                        +parseInt(
                          settings.decimals[currentAsset || 'sxp'].vtoken,
                          10
                        )
                    )
                  )
                )
                .toString(10)
            ).toFixed(6)} ${marketInfo.symbol || ''}`}
          </p>
        </div>
      </CardWrapper>
    </Card>
  );
}

Overview.propTypes = {
  settings: PropTypes.object,
  getMarketHistory: PropTypes.func.isRequired
};

Overview.defaultProps = {
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

export default compose(connectAccount(mapStateToProps, mapDispatchToProps))(
  Overview
);
