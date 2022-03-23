import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Select, Icon } from 'antd';
import { connect } from 'react-redux';
import { accountActionCreators } from 'core/modules/account/actions';
import OverviewChart from 'components/Basic/OverviewChart';
import { promisify } from 'utilities';
import * as constants from 'utilities/constants';
import {
  addToken,
  getBigNumber,
  formatApy,
  format,
  formatCommaThousandsPeriodDecimal,
} from 'utilities/common';
import { Card } from 'components/Basic/Card';
import { uid } from 'react-uid';
import { Setting } from 'types';
import { State } from 'core/modules/initialState';
import { useMarkets } from '../../hooks/useMarkets';
import { useMarketsUser } from '../../hooks/useMarketsUser';
import { VTOKEN_DECIMALS } from '../../config';

const CardWrapper = styled.div`
  width: 100%;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
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
        margin-left: 0;
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
      margin-top: 4px;
      i {
        color: var(--color-text-main);
      }
    }
  }
`;

const { Option } = Select;
const abortController = new AbortController();

interface OverviewProps {
  settings: Setting;
  getMarketHistory: $TSFixMe;
}

function Overview({ settings, getMarketHistory }: OverviewProps) {
  const [currentAsset, setCurrentAsset] = useState('sxp');
  const [data, setData] = useState([]);
  const [marketInfo, setMarketInfo] = useState({});
  const [currentAPY, setCurrentAPY] = useState(0);
  const [decimals, setDecimals] = useState(18);
  const { markets } = useMarkets();
  const { userMarketInfo } = useMarketsUser();

  const getGraphData = async (
    asset: $TSFixMe,

    type: $TSFixMe,

    limit: $TSFixMe,
  ) => {
    let tempData = [];
    const res = await promisify(getMarketHistory, { asset, type, limit });
    // @ts-expect-error ts-migrate(2571) FIXME: Object is of type 'unknown'.
    tempData = res.data.result

      .map((m: $TSFixMe) => ({
        createdAt: m.createdAt,
        supplyApy: +new BigNumber(m.supplyApy || 0).dp(8, 1).toString(10),
        borrowApy: +new BigNumber(m.borrowApy || 0).dp(8, 1).toString(10),
      }))
      .reverse();
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
    setData([...tempData]);
  };

  useEffect(() => {
    if (!currentAsset) return;
    if (markets && markets.length > 0) {
      const info = markets.find(item => item.underlyingSymbol.toLowerCase() === currentAsset);
      setMarketInfo(info || {});
    }
  }, [markets, currentAsset]);

  useEffect(() => {
    if (currentAsset) {
      getGraphData(
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        constants.CONTRACT_VBEP_ADDRESS[currentAsset].address,
        '1hr',
        24 * 7, // 1 week
      );
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [currentAsset]);

  useEffect(() => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'length' does not exist on type '{}'.
    if (userMarketInfo && userMarketInfo.length > 0) {
      const currentMarketInfo =
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'filter' does not exist on type '{}'.
        userMarketInfo.filter((s: $TSFixMe) => s && s.id === currentAsset).length !== 0
          ? // @ts-expect-error ts-migrate(2339) FIXME: Property 'filter' does not exist on type '{}'.
            userMarketInfo.filter((s: $TSFixMe) => s && s.id === currentAsset)[0]
          : {};
      const supplyApy = getBigNumber(currentMarketInfo.supplyApy);
      const borrowApy = getBigNumber(currentMarketInfo.borrowApy);
      const supplyApyWithXVS = settings.withXVS
        ? supplyApy.plus(currentMarketInfo.xvsSupplyApy)
        : supplyApy;
      const borrowApyWithXVS = settings.withXVS
        ? getBigNumber(currentMarketInfo.xvsBorrowApy).plus(borrowApy)
        : borrowApy;
      setDecimals(currentMarketInfo.decimals);
      setCurrentAPY(
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        (settings.marketType || 'supply') === 'supply'
          ? supplyApyWithXVS.dp(2, 1).toString(10)
          : borrowApyWithXVS.dp(2, 1).toString(10),
      );
    }
  }, [currentAsset, settings.marketType, userMarketInfo, settings.withXVS]);

  const handleChangeAsset = (value: $TSFixMe) => {
    setCurrentAsset(value);
  };

  return (
    <Card>
      <CardWrapper>
        <div className="flex align-center just-between">
          <div className="flex align-center just-between asset-select-wrapper">
            <AssetSelectWrapper className="flex align-center just-end" id="asset">
              <Select
                defaultValue="sxp"
                style={{ width: 150, marginRight: 10 }}
                // @ts-expect-error ts-migrate(2322) FIXME: Type '() => HTMLElement | null' is not assignable ... Remove this comment to see the full error message
                getPopupContainer={() => document.getElementById('asset')}
                dropdownMenuStyle={{
                  backgroundColor: 'var(--color-bg-main)',
                }}
                dropdownClassName="asset-select"
                onChange={handleChangeAsset}
              >
                {Object.keys(constants.CONTRACT_VBEP_ADDRESS).map(key => (
                  <Option
                    className="flex align-center just-between"
                    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    value={constants.CONTRACT_VBEP_ADDRESS[key].id}
                    key={uid(key)}
                  >
                    <img
                      className="asset-img"
                      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                      src={constants.CONTRACT_TOKEN_ADDRESS[key].asset}
                      alt="asset"
                    />{' '}
                    <span>
                      {/* @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
                      {constants.CONTRACT_TOKEN_ADDRESS[key].symbol}
                    </span>
                  </Option>
                ))}
              </Select>
              <div className="value">Overview</div>
            </AssetSelectWrapper>
            {window.ethereum && window.ethereum.networkVersion && (
              <div className="flex align-center add-token-wrapper">
                {currentAsset && currentAsset !== 'bnb' && (
                  <div className="flex align-center underlying-asset">
                    {/* @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
                    {constants.CONTRACT_TOKEN_ADDRESS[currentAsset].symbol}
                    <Icon
                      className="add-token"
                      type="plus-circle"
                      theme="filled"
                      onClick={() =>
                        addToken({
                          asset: currentAsset,
                          decimal: decimals,
                          type: 'token',
                        })
                      }
                    />
                  </div>
                )}
                <div className="flex align-center vtoken-asset">
                  {`v${currentAsset === 'btcb' ? 'BTC' : currentAsset.toUpperCase()}`}
                  <Icon
                    className="add-token"
                    type="plus-circle"
                    theme="filled"
                    onClick={() =>
                      addToken({
                        asset: currentAsset,
                        decimal: VTOKEN_DECIMALS,
                        type: 'vtoken',
                      })
                    }
                  />
                </div>
                <p className="destination">To MetaMask</p>
              </div>
            )}
          </div>
        </div>
        <div className="historic-label">Historical rates</div>
        <div className="flex flex-column flex-end">
          <p
            className={
              (settings.marketType || 'supply') === 'supply' || currentAPY >= 0
                ? 'apy-value'
                : 'apy-value-red'
            }
          >
            {formatApy(currentAPY)}
          </p>
          <p className="apy-label">
            {(settings.marketType || 'supply') === 'supply' ? 'Supply APY' : 'Borrow APY'}
          </p>
        </div>
        <OverviewChart marketType={settings.marketType || 'supply'} data={data} />
        <div className="description">
          <p className="label">Price</p>
          <p className="value">
            {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'underlyingPrice' does not exist on type ... Remove this comment to see the full error message */}
            {`$${new BigNumber(marketInfo.underlyingPrice || 0)
              .div(new BigNumber(10).pow(18 + 18 - decimals))
              .dp(8, 1)
              .toString(10)}`}
          </p>
        </div>
        <div className="description">
          <p className="label">Market Liquidity</p>
          <p className="value">
            {`${format(
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'cash' does not exist on type '{}'.
              new BigNumber(marketInfo.cash || 0).div(new BigNumber(10).pow(decimals)),
              8,
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'underlyingSymbol' does not exist on type... Remove this comment to see the full error message
            )} ${marketInfo.underlyingSymbol || ''}`}
          </p>
        </div>
        <div className="description">
          <p className="label"># of Suppliers</p>
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'supplierCount' does not exist on type '{... Remove this comment to see the full error message */}
          <p className="value">{formatCommaThousandsPeriodDecimal(marketInfo.supplierCount)}</p>
        </div>
        <div className="description">
          <p className="label"># of Borrowers</p>
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'borrowerCount' does not exist on type '{... Remove this comment to see the full error message */}
          <p className="value">{formatCommaThousandsPeriodDecimal(marketInfo.borrowerCount)}</p>
        </div>
        <div className="description">
          <p className="label">Reserves</p>
          <p className="value">
            {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'totalReserves' does not exist on type '{... Remove this comment to see the full error message */}
            {`${new BigNumber(marketInfo.totalReserves || 0)
              .div(new BigNumber(10).pow(decimals))
              .dp(8, 1)
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'underlyingSymbol' does not exist on type... Remove this comment to see the full error message
              .toString(10)} ${marketInfo.underlyingSymbol || ''}`}
          </p>
        </div>
        <div className="description">
          <p className="label">Reserve Factor</p>
          <p className="value">
            {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'reserveFactor' does not exist on type '{... Remove this comment to see the full error message */}
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
            {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'collateralFactor' does not exist on type... Remove this comment to see the full error message */}
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
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'totalSupplyUsd' does not exist on type '... Remove this comment to see the full error message
              new BigNumber(marketInfo.totalSupplyUsd || 0),
            )}`}
          </p>
        </div>
        <div className="description">
          <p className="label">Total Borrow</p>
          <p className="value">
            {`$${format(
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'totalBorrowsUsd' does not exist on type ... Remove this comment to see the full error message
              new BigNumber(marketInfo.totalBorrowsUsd || 0),
            )}`}
          </p>
        </div>
        <div className="description">
          <p className="label">Exchange Rate</p>
          <p className="value">
            {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'underlyingSymbol' does not exist on type... Remove this comment to see the full error message */}
            {`1 ${marketInfo.underlyingSymbol || ''} = ${Number(
              new BigNumber(1)
                .div(
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'exchangeRate' does not exist on type '{}... Remove this comment to see the full error message
                  new BigNumber(marketInfo.exchangeRate).div(
                    new BigNumber(10).pow(18 + decimals - VTOKEN_DECIMALS),
                  ),
                )
                .toString(10),
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'symbol' does not exist on type '{}'.
            ).toFixed(6)} ${marketInfo.symbol || ''}`}
          </p>
        </div>
      </CardWrapper>
    </Card>
  );
}

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connect(mapStateToProps, accountActionCreators)(Overview);
