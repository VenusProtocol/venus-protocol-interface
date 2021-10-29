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
  getVbepContract,
  getComptrollerContract,
  methods
} from 'utilities/ContractService';
import commaNumber from 'comma-number';
import coinImg from 'assets/img/venus_32.png';
import arrowRightImg from 'assets/img/arrow-right.png';
import vaiImg from 'assets/img/coins/vai.svg';
import feeImg from 'assets/img/fee.png';
import { TabSection, Tabs, TabContent } from 'components/Basic/SupplyModal';
import { getBigNumber } from 'utilities/common';

const format = commaNumber.bindWith(',', '.');
const abortController = new AbortController();

function WithdrawTab({ asset, settings, changeTab, onCancel, setSetting }) {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const [borrowLimit, setBorrowLimit] = useState(new BigNumber(0));
  const [borrowPercent, setBorrowPercent] = useState(new BigNumber(0));
  const [newBorrowLimit, setNewBorrowLimit] = useState(new BigNumber(0));
  const [newBorrowPercent, setNewBorrowPercent] = useState(new BigNumber(0));
  const [safeMaxBalance, setSafeMaxBalance] = useState(new BigNumber(0));
  const [feePercent, setFeePercent] = useState(new BigNumber(0));

  const getFeePercent = async () => {
    const appContract = getComptrollerContract();
    const treasuryPercent = await methods.call(
      appContract.methods.treasuryPercent,
      []
    );
    setFeePercent(new BigNumber(treasuryPercent).times(100).div(1e18));
  };

  useEffect(() => {
    getFeePercent();
  }, []);

  const updateInfo = useCallback(async () => {
    const totalBorrowBalance = getBigNumber(settings.totalBorrowBalance);
    const totalBorrowLimit = getBigNumber(settings.totalBorrowLimit);
    const tokenPrice = getBigNumber(asset.tokenPrice);
    const { collateral } = asset;
    const supplyBalance = getBigNumber(asset.supplyBalance);
    const collateralFactor = getBigNumber(asset.collateralFactor);
    if (!collateral) {
      setSafeMaxBalance(supplyBalance);
      return;
    }
    const safeMax = BigNumber.maximum(
      totalBorrowLimit
        .minus(totalBorrowBalance.div(40).times(100))
        .div(collateralFactor)
        .div(tokenPrice),
      new BigNumber(0)
    );
    setSafeMaxBalance(BigNumber.minimum(safeMax, supplyBalance));

    if (tokenPrice && !amount.isZero() && !amount.isNaN()) {
      const temp = totalBorrowLimit.minus(
        amount.times(tokenPrice).times(collateralFactor)
      );
      setNewBorrowLimit(temp);
      setNewBorrowPercent(totalBorrowBalance.div(temp).times(100));
      if (totalBorrowLimit.isZero()) {
        setBorrowLimit(new BigNumber(0));
        setBorrowPercent(new BigNumber(0));
      } else {
        setBorrowLimit(totalBorrowLimit);
        setBorrowPercent(totalBorrowBalance.div(totalBorrowLimit).times(100));
      }
    } else {
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
    if (asset.vtokenAddress && settings.selectedAddress) {
      updateInfo();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.selectedAddress, updateInfo]);

  /**
   * Withdraw
   */
  const handleWithdraw = async () => {
    const { id: assetId } = asset;
    const appContract = getVbepContract(assetId);
    if (assetId && settings.selectedAddress) {
      setIsLoading(true);
      setSetting({
        pendingInfo: {
          type: 'Withdraw',
          status: true,
          amount: amount.dp(8, 1).toString(10),
          symbol: asset.symbol
        }
      });
      try {
        if (amount.eq(asset.supplyBalance)) {
          const vTokenBalance = await methods.call(
            appContract.methods.balanceOf,
            [settings.selectedAddress]
          );
          await methods.send(
            appContract.methods.redeem,
            [vTokenBalance],
            settings.selectedAddress
          );
        } else {
          await methods.send(
            appContract.methods.redeemUnderlying,
            [
              amount
                .times(new BigNumber(10).pow(settings.decimals[assetId].token))
                .integerValue()
                .toString(10)
            ],
            settings.selectedAddress
          );
        }
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
      } catch (error) {
        setIsLoading(false);
        setSetting({
          pendingInfo: {
            type: '',
            status: false,
            amount: 0,
            symbol: ''
          }
        });
      }
    }
  };
  /**
   * Max amount
   */
  const handleMaxAmount = () => {
    setAmount(safeMaxBalance);
  };

  return (
    <TabSection>
      <div className="flex flex-column align-center just-center body-content">
        <div className="flex align-center input-wrapper">
          <NumberFormat
            autoFocus
            value={amount.isZero() ? '0' : amount.toString(10)}
            onValueChange={({ value }) => {
              setAmount(new BigNumber(value));
            }}
            isAllowed={({ value }) => {
              const temp = new BigNumber(value || 0);
              const { totalBorrowLimit } = settings;
              const { tokenPrice, collateralFactor } = asset;
              return (
                temp.isLessThanOrEqualTo(asset.supplyBalance) &&
                getBigNumber(totalBorrowLimit).isGreaterThanOrEqualTo(
                  temp.times(tokenPrice).times(collateralFactor)
                )
              );
            }}
            thousandSeparator
            allowNegative={false}
            placeholder="0"
          />
          <span className="pointer max" onClick={() => handleMaxAmount()}>
            SAFE MAX
          </span>
        </div>
        <p className="warning-label center">
          Your available withdraw amount = Total Supply Amount - VAI Mint Amount
          - Borrowed Amount
        </p>
      </div>
      <Tabs className="flex align-center">
        <div
          className="flex align-center just-center tab-item pointer"
          onClick={() => {
            changeTab('supply');
          }}
        >
          Supply
        </div>
        <div
          className="flex align-center just-center tab-item pointer tab-active"
          onClick={() => {
            changeTab('withdraw');
          }}
        >
          Withdraw
        </div>
      </Tabs>
      <TabContent className="flex flex-column align-center just-content">
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
          {asset.symbol !== 'BNB' && (
            <div className="description">
              <div className="flex align-center">
                <img
                  src={feeImg}
                  style={{
                    width: 25,
                    height: 25,
                    marginLeft: 2,
                    marginRight: 16
                  }}
                  alt="fee"
                />
                <span>Fee</span>
              </div>
              <span>
                {!amount.isNaN()
                  ? new BigNumber(amount)
                      .times(feePercent / 100)
                      .dp(4)
                      .toString(10)
                  : 0}{' '}
                {asset.symbol} ({feePercent.toString(10)}%)
              </span>
            </div>
          )}
        </div>
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

        <Button
          className="button"
          disabled={
            isLoading ||
            amount.isNaN() ||
            amount.isZero() ||
            amount.isGreaterThan(asset.supplyBalance) ||
            newBorrowPercent.isGreaterThan(new BigNumber(100))
          }
          onClick={handleWithdraw}
        >
          {isLoading && <Icon type="loading" />} Withdraw
        </Button>
        <div className="description">
          <span>Protocol Balance</span>
          <span>
            {format(asset.supplyBalance.dp(2, 1).toString(10))} {asset.symbol}
          </span>
        </div>
      </TabContent>
    </TabSection>
  );
}

WithdrawTab.propTypes = {
  asset: PropTypes.object,
  settings: PropTypes.object,
  changeTab: PropTypes.func,
  onCancel: PropTypes.func,
  setSetting: PropTypes.func.isRequired
};

WithdrawTab.defaultProps = {
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
  WithdrawTab
);
