import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import NumberFormat from 'react-number-format';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import BigNumber from 'bignumber.js';
import {
  getTokenContract,
  getVbepContract,
  methods
} from 'utilities/ContractService';
import { sendRepay } from 'utilities/BnbContract';
import commaNumber from 'comma-number';
import arrowRightImg from 'assets/img/arrow-right.png';
import coinImg from 'assets/img/venus_32.png';
import vaiImg from 'assets/img/coins/vai.svg';
import { Icon, Progress } from 'antd';
import { TabSection, Tabs, TabContent } from 'components/Basic/BorrowModal';
import { getBigNumber } from 'utilities/common';

const format = commaNumber.bindWith(',', '.');
const abortController = new AbortController();

function RepayBorrowTab({ asset, settings, changeTab, onCancel, setSetting }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const [borrowBalance, setBorrowBalance] = useState(new BigNumber(0));
  const [borrowPercent, setBorrowPercent] = useState(new BigNumber(0));
  const [newBorrowBalance, setNewBorrowBalance] = useState(new BigNumber(0));
  const [newBorrowPercent, setNewBorrowPercent] = useState(new BigNumber(0));

  const updateInfo = useCallback(() => {
    const totalBorrowBalance = getBigNumber(settings.totalBorrowBalance);
    const totalBorrowLimit = getBigNumber(settings.totalBorrowLimit);
    const tokenPrice = getBigNumber(asset.tokenPrice);
    if (amount.isZero() || amount.isNaN()) {
      setBorrowBalance(totalBorrowBalance);
      if (totalBorrowLimit.isZero()) {
        setBorrowPercent(new BigNumber(0));
        setNewBorrowPercent(new BigNumber(0));
      } else {
        setBorrowPercent(totalBorrowBalance.div(totalBorrowLimit).times(100));
        setNewBorrowPercent(
          totalBorrowBalance.div(totalBorrowLimit).times(100)
        );
      }
    } else {
      const temp = totalBorrowBalance.minus(amount.times(tokenPrice));
      setBorrowBalance(totalBorrowBalance);
      setNewBorrowBalance(temp);
      if (totalBorrowLimit.isZero()) {
        setBorrowPercent(new BigNumber(0));
        setNewBorrowPercent(new BigNumber(0));
      } else {
        setBorrowPercent(totalBorrowBalance.div(totalBorrowLimit).times(100));
        setNewBorrowPercent(temp.div(totalBorrowLimit).times(100));
      }
    }
  }, [settings.selectedAddress, amount, asset]);

  useEffect(() => {
    if (asset.vtokenAddress && settings.selectedAddress) {
      updateInfo();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.selectedAddress, updateInfo, asset]);

  /**
   * Approve underlying token
   */
  const onApprove = async () => {
    if (asset && settings.selectedAddress && asset.id !== 'bnb') {
      setIsLoading(true);
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
   * Repay Borrow
   */
  const handleRepayBorrow = async () => {
    const appContract = getVbepContract(asset.id);
    if (asset && settings.selectedAddress) {
      setIsLoading(true);
      setSetting({
        pendingInfo: {
          type: 'Repay Borrow',
          status: true,
          amount: amount.dp(8, 1).toString(10),
          symbol: asset.symbol
        }
      });
      if (asset.id !== 'bnb') {
        if (amount.eq(asset.borrowBalance)) {
          await methods.send(
            appContract.methods.repayBorrow,
            [
              new BigNumber(2)
                .pow(256)
                .minus(1)
                .toString(10)
            ],
            settings.selectedAddress
          );
        } else {
          await methods.send(
            appContract.methods.repayBorrow,
            [
              amount
                .times(new BigNumber(10).pow(settings.decimals[asset.id].token))
                .integerValue()
                .toString(10)
            ],
            settings.selectedAddress
          );
        }
        setAmount(new BigNumber(0));
        onCancel();
        setIsLoading(false);
        setSetting({
          pendingInfo: {
            type: '',
            status: false,
            amount: 0,
            symbol: ''
          }
        });
      } else {
        sendRepay(
          settings.selectedAddress,
          amount
            .times(new BigNumber(10).pow(settings.decimals[asset.id].token))
            .integerValue()
            .toString(10),
          () => {
            setAmount(new BigNumber(0));
            setIsLoading(false);
            onCancel();
            setSetting({
              pendingInfo: {
                type: '',
                status: false,
                amount: 0,
                symbol: ''
              }
            });
          }
        );
      }
    }
  };

  /**
   * Max amount
   */
  const handleMaxAmount = () => {
    setAmount(BigNumber.minimum(asset.walletBalance, asset.borrowBalance));
  };

  useEffect(() => {
    setIsEnabled(asset.isEnabled);
  }, [asset.isEnabled]);

  return (
    <TabSection>
      <div className="flex flex-column align-center just-center body-content">
        {isEnabled ? (
          <div className="flex align-center input-wrapper">
            <NumberFormat
              autoFocus
              value={amount.isZero() ? '0' : amount.toString(10)}
              onValueChange={values => {
                const { value } = values;
                setAmount(new BigNumber(value));
              }}
              isAllowed={({ value }) => {
                return new BigNumber(value || 0).isLessThanOrEqualTo(
                  BigNumber.minimum(asset.walletBalance, asset.borrowBalance)
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
              To Repay {asset.name} to the Venus Protocol, you need to enable it
              first.
            </p>
          </>
        )}
      </div>
      <Tabs className="flex align-center">
        <div
          className="flex align-center just-center tab-item pointer"
          onClick={() => {
            changeTab('borrow');
          }}
        >
          Borrow
        </div>
        <div
          className="flex align-center just-center tab-item pointer tab-active"
          onClick={() => {
            changeTab('repayBorrow');
          }}
        >
          Repay Borrow
        </div>
      </Tabs>
      <TabContent className="flex flex-column align-center just-content">
        <div className="flex flex-column just-center align-center apy-content">
          <div className="description">
            <div className="flex align-center">
              <img className="asset-img" src={asset.img} alt="asset" />
              <span>Borrow APY</span>
            </div>
            <span>{asset.borrowApy.dp(2, 1).toString(10)}%</span>
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
              {getBigNumber(asset.xvsBorrowApy)
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
              <span>Repay VAI Balance</span>
            </div>
            <span>
              {getBigNumber(settings.userVaiMinted)
                .dp(2, 1)
                .toString(10)}{' '}
              VAI
            </span>
          </div>
        </div>
        {isEnabled && (
          <div className="flex flex-column just-center align-center apy-content">
            <div className="borrow-balance">
              <span>Borrow Balance</span>
              {amount.isZero() || amount.isNaN() ? (
                <span>${borrowBalance.dp(2, 1).toString(10)}</span>
              ) : (
                <div className="flex align-center just-between">
                  <span>${borrowBalance.dp(2, 1).toString(10)}</span>
                  <img
                    className="arrow-right-img"
                    src={arrowRightImg}
                    alt="arrow"
                  />
                  <span>${newBorrowBalance.dp(2, 1).toString(10)}</span>
                </div>
              )}
            </div>
            <div className="borrow-limit">
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
              amount.isZero() ||
              amount.isNaN() ||
              amount.isGreaterThan(
                BigNumber.minimum(asset.walletBalance, asset.borrowBalance)
              )
            }
            onClick={handleRepayBorrow}
          >
            {isLoading && <Icon type="loading" />} Repay Borrow
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

RepayBorrowTab.propTypes = {
  asset: PropTypes.object,
  settings: PropTypes.object,
  changeTab: PropTypes.func,
  onCancel: PropTypes.func,
  setSetting: PropTypes.func.isRequired
};

RepayBorrowTab.defaultProps = {
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
  RepayBorrowTab
);
