import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { compose } from 'recompose';
import { Icon, Progress } from 'antd';
import Button from '@material-ui/core/Button';
import NumberFormat from 'react-number-format';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import {
  getTokenContract,
  getVbepContract,
  methods
} from 'utilities/ContractService';
import commaNumber from 'comma-number';
import { sendSupply } from 'utilities/BnbContract';
import coinImg from 'assets/img/venus_32.png';
import arrowRightImg from 'assets/img/arrow-right.png';
import vaiImg from 'assets/img/coins/vai.svg';
import { TabSection, Tabs, TabContent } from 'components/Basic/SupplyModal';
import { getBigNumber } from 'utilities/common';

const format = commaNumber.bindWith(',', '.');
const abortController = new AbortController();

function SupplyTab({ asset, settings, changeTab, onCancel, setSetting }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const [borrowLimit, setBorrowLimit] = useState(new BigNumber(0));
  const [borrowPercent, setBorrowPercent] = useState(new BigNumber(0));
  const [newBorrowLimit, setNewBorrowLimit] = useState(new BigNumber(0));
  const [newBorrowPercent, setNewBorrowPercent] = useState(new BigNumber(0));

  const updateInfo = useCallback(async () => {
    const totalBorrowBalance = getBigNumber(settings.totalBorrowBalance);
    const totalBorrowLimit = getBigNumber(settings.totalBorrowLimit);
    const tokenPrice = getBigNumber(asset.tokenPrice);
    const collateralFactor = getBigNumber(asset.collateralFactor);

    if (tokenPrice && !amount.isZero() && !amount.isNaN()) {
      const temp = totalBorrowLimit.plus(
        amount.times(tokenPrice).times(collateralFactor)
      );
      setNewBorrowLimit(BigNumber.maximum(temp, 0));
      setNewBorrowPercent(totalBorrowBalance.div(temp).times(100));
      if (totalBorrowLimit.isZero()) {
        setBorrowLimit(new BigNumber(0));
        setBorrowPercent(new BigNumber(0));
      } else {
        setBorrowLimit(totalBorrowLimit);
        setBorrowPercent(totalBorrowBalance.div(totalBorrowLimit).times(100));
      }
    } else if (BigNumber.isBigNumber(totalBorrowLimit)) {
      setBorrowLimit(totalBorrowLimit);
      setNewBorrowLimit(totalBorrowLimit);
      if (totalBorrowLimit.isZero()) {
        setBorrowPercent(new BigNumber(0));
        setNewBorrowPercent(new BigNumber(0));
      } else {
        setBorrowPercent(totalBorrowBalance.div(totalBorrowLimit).times(100));
        setNewBorrowPercent(
          totalBorrowBalance.div(totalBorrowLimit).times(100)
        );
      }
    }
  }, [settings.selectedAddress, amount]);

  useEffect(() => {
    setIsEnabled(asset.isEnabled);
  }, [asset.isEnabled]);

  /**
   * Get Allowed amount
   */
  useEffect(() => {
    if (asset.vtokenAddress && settings.selectedAddress) {
      updateInfo();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.selectedAddress, updateInfo]);
  /**
   * Approve underlying token
   */
  const onApprove = async () => {
    if (asset.id && settings.selectedAddress && asset.id !== 'bnb') {
      setIsLoading(true);
      // const binanceConnect = BinanceWalletConnectClass.initialize();
      // binanceConnect.sendApprove(
      //   asset.id,
      //   settings.selectedAddress,
      //   asset.vtokenAddress,
      //   new BigNumber(2)
      //     .pow(256)
      //     .minus(1)
      //     .toString(10),
      //   () => {
      //     setAmount(new BigNumber(0));
      //     setIsLoading(false);
      //     onCancel();
      //   }
      // );
      const tokenContract = getTokenContract(asset.id);
      methods
        .send(
          tokenContract.methods.approve,
          [
            asset.vtokenAddress,
            new BigNumber(2)
              .pow(256)
              .minus(1)
              .toString(10)
          ],
          settings.selectedAddress
        )
        .then(() => {
          setIsEnabled(true);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  /**
   * Supply
   */
  const handleSupply = () => {
    const appContract = getVbepContract(asset.id);
    // const binanceConnect = BinanceWalletConnectClass.initialize();
    // binanceConnect.sendSupply(
    //   asset.id,
    //   settings.selectedAddress,
    //   amount
    //     .times(new BigNumber(10).pow(settings.decimals[asset.id].token))
    //     .toString(10),
    //   () => {
    //     setAmount(new BigNumber(0));
    //     setIsLoading(false);
    //     onCancel();
    //   }
    // );

    if (asset.id && settings.selectedAddress) {
      setIsLoading(true);
      setSetting({
        pendingInfo: {
          type: 'Supply',
          status: true,
          amount: amount.dp(8, 1).toString(10),
          symbol: asset.symbol
        }
      });
      if (asset.id !== 'bnb') {
        methods
          .send(
            appContract.methods.mint,
            [
              amount
                .times(new BigNumber(10).pow(settings.decimals[asset.id].token))
                .toString(10)
            ],
            settings.selectedAddress
          )
          .then(() => {
            setAmount(new BigNumber(0));
            setIsLoading(false);
            setSetting({
              pendingInfo: {
                type: '',
                status: false,
                amount: 0,
                symbol: ''
              }
            });
            onCancel();
          })
          .catch(() => {
            setIsLoading(false);
            setSetting({
              pendingInfo: {
                type: '',
                status: false,
                amount: 0,
                symbol: ''
              }
            });
          });
      } else {
        sendSupply(
          settings.selectedAddress,
          amount
            .times(new BigNumber(10).pow(settings.decimals[asset.id].token))
            .toString(10),
          () => {
            setAmount(new BigNumber(0));
            setIsLoading(false);
            setSetting({
              pendingInfo: {
                type: '',
                status: false,
                amount: 0,
                symbol: ''
              }
            });
            onCancel();
          }
        );
      }
    }
  };
  /**
   * Max amount
   */
  const handleMaxAmount = () => {
    setAmount(asset.walletBalance);
  };

  return (
    <TabSection>
      <div className="flex flex-column align-center just-center body-content">
        {asset.id === 'bnb' || isEnabled ? (
          <div className="flex align-center input-wrapper">
            <NumberFormat
              autoFocus
              value={amount.isZero() ? '0' : amount.toString(10)}
              onValueChange={({ value }) => {
                setAmount(new BigNumber(value));
              }}
              isAllowed={({ value }) => {
                return new BigNumber(value || 0).isLessThanOrEqualTo(
                  asset.walletBalance
                );
              }}
              thousandSeparator
              allowNegative={false}
              placeholder="0"
            />
            <span className="pointer max" onClick={() => handleMaxAmount()}>
              MAX
            </span>
          </div>
        ) : (
          <>
            <img src={asset.img} alt="asset" />
            <p className="center warning-label">
              To Supply {asset.name} to the Venus Protocol, you need to approve
              it first.
            </p>
          </>
        )}
      </div>
      <Tabs className="flex align-center">
        <div
          className="flex align-center just-center tab-item pointer tab-active"
          onClick={() => {
            changeTab('supply');
          }}
        >
          Supply
        </div>
        <div
          className="flex align-center just-center tab-item pointer"
          onClick={() => {
            changeTab('withdraw');
          }}
        >
          Withdraw
        </div>
      </Tabs>
      <TabContent className="flex flex-column align-center just-center">
        <div className="flex flex-column just-center align-center apy-content">
          <div className="description">
            <div className="flex align-center">
              <img className="asset-img" src={asset.img} alt="asset" />
              <span>Supply APY</span>
            </div>
            <span>{asset.supplyApy.dp(2, 1).toString(10)}%</span>
          </div>
          <div className="description">
            <div className="flex align-center">
              <img
                style={{
                  width: 25,
                  height: 25,
                  marginLeft: 2,
                  marginRight: 16
                }}
                src={coinImg}
                alt="asset"
              />
              <span>Distribution APY</span>
            </div>
            <span>
              {getBigNumber(asset.xvsSupplyApy)
                .dp(2, 1)
                .toString(10)}
              %
            </span>
          </div>
          <div className="description">
            <div className="flex align-center">
              <img
                style={{
                  width: 25,
                  height: 25,
                  marginLeft: 2,
                  marginRight: 16
                }}
                src={vaiImg}
                alt="asset"
              />
              <span>Available VAI Limit</span>
            </div>
            <span>
              {getBigNumber(settings.mintableVai)
                .dp(2, 1)
                .toString(10)}{' '}
              VAI
            </span>
          </div>
        </div>
        {isEnabled && (
          <div className="flex flex-column just-center align-center apy-content">
            <div className="borrow-limit">
              <span>Borrow Limit</span>
              {amount.isZero() || amount.isNaN() ? (
                <span>${format(borrowLimit.dp(2, 1).toString(10))}</span>
              ) : (
                <div className="flex align-center just-between">
                  <span>${format(borrowLimit.dp(2, 1).toString(10))}</span>
                  <img
                    className="arrow-right-img"
                    src={arrowRightImg}
                    alt="arrow"
                  />
                  <span>${format(newBorrowLimit.dp(2, 1).toString(10))}</span>
                </div>
              )}
            </div>
            <div className="flex align-center just-between borrow-limit-used">
              <span>Borrow Limit Used</span>
              {amount.isZero() || amount.isNaN() ? (
                <span>{borrowPercent.dp(2, 1).toString(10)}%</span>
              ) : (
                <div className="flex align-center just-between">
                  <span>{borrowPercent.dp(2, 1).toString(10)}%</span>
                  <img
                    className="arrow-right-img"
                    src={arrowRightImg}
                    alt="arrow"
                  />
                  <span>{newBorrowPercent.dp(2, 1).toString(10)}%</span>
                </div>
              )}
            </div>
            <Progress
              percent={newBorrowPercent.toString(10)}
              strokeColor="#d99d43"
              strokeWidth={7}
              showInfo={false}
            />
          </div>
        )}
        {!isEnabled && asset.id !== 'bnb' ? (
          <Button
            className="button"
            disabled={isLoading}
            onClick={() => {
              onApprove();
            }}
          >
            {isLoading && <Icon type="loading" />} Enable
          </Button>
        ) : (
          <Button
            className="button"
            disabled={
              isLoading ||
              amount.isNaN() ||
              amount.isZero() ||
              amount.isGreaterThan(asset.walletBalance)
            }
            onClick={handleSupply}
          >
            {isLoading && <Icon type="loading" />} Supply
          </Button>
        )}
        <div className="description">
          <span>Wallet Balance</span>
          <span>
            {format(asset.walletBalance.dp(2, 1).toString(10))} {asset.symbol}
          </span>
        </div>
      </TabContent>
    </TabSection>
  );
}

SupplyTab.propTypes = {
  asset: PropTypes.object,
  settings: PropTypes.object,
  changeTab: PropTypes.func,
  onCancel: PropTypes.func,
  setSetting: PropTypes.func.isRequired
};

SupplyTab.defaultProps = {
  asset: {},
  settings: {},
  changeTab: () => {},
  onCancel: () => {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

const mapDispatchToProps = dispatch => {
  const { setSetting } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting
    },
    dispatch
  );
};

export default compose(connectAccount(mapStateToProps, mapDispatchToProps))(
  SupplyTab
);
