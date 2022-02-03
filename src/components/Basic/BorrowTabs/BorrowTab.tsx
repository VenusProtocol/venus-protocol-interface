import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Icon, Progress } from 'antd';
import Button from '@material-ui/core/Button';
import NumberFormat from 'react-number-format';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import arrowRightImg from 'assets/img/arrow-right.png';
import coinImg from 'assets/img/venus_32.png';
import vaiImg from 'assets/img/coins/vai.svg';
import { TabSection, Tabs, TabContent } from 'components/Basic/BorrowModal';
import { getBigNumber, formatApy } from 'utilities/common';
import { useWeb3React } from '@web3-react/core';
import { useVaiUser } from '../../../hooks/useVaiUser';
import { useMarketsUser } from '../../../hooks/useMarketsUser';
import { useVbep } from '../../../hooks/useContract';

const format = commaNumber.bindWith(',', '.');
const abortController = new AbortController();

function BorrowTab({ asset, changeTab, onCancel, setSetting }) {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const [borrowBalance, setBorrowBalance] = useState(new BigNumber(0));
  const [borrowPercent, setBorrowPercent] = useState(new BigNumber(0));
  const [newBorrowBalance, setNewBorrowBalance] = useState(new BigNumber(0));
  const [newBorrowPercent, setNewBorrowPercent] = useState(new BigNumber(0));
  const { account } = useWeb3React();
  const { userVaiMinted } = useVaiUser();
  const { userTotalBorrowBalance, userTotalBorrowLimit } = useMarketsUser();
  const vbepContract = useVbep(asset.id);

  const updateInfo = useCallback(() => {
    const tokenPrice = getBigNumber(asset.tokenPrice);
    if (amount.isZero() || amount.isNaN()) {
      setBorrowBalance(userTotalBorrowBalance);
      if (userTotalBorrowLimit.isZero()) {
        setBorrowPercent(new BigNumber(0));
        setNewBorrowPercent(new BigNumber(0));
      } else {
        setBorrowPercent(
          userTotalBorrowBalance.div(userTotalBorrowLimit).times(100)
        );
        setNewBorrowPercent(
          userTotalBorrowBalance.div(userTotalBorrowLimit).times(100)
        );
      }
    } else {
      const temp = userTotalBorrowBalance.plus(amount.times(tokenPrice));
      setBorrowBalance(userTotalBorrowBalance);
      setNewBorrowBalance(temp);
      if (userTotalBorrowLimit.isZero()) {
        setBorrowPercent(new BigNumber(0));
        setNewBorrowPercent(new BigNumber(0));
      } else {
        setBorrowPercent(
          userTotalBorrowBalance.div(userTotalBorrowLimit).times(100)
        );
        setNewBorrowPercent(temp.div(userTotalBorrowLimit).times(100));
      }
    }
  }, [amount, asset, userTotalBorrowBalance, userTotalBorrowLimit]);

  /**
   * Get Allowed amount
   */
  useEffect(() => {
    if (asset.vtokenAddress && account) {
      updateInfo();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [account, updateInfo, asset]);

  /**
   * Borrow
   */
  const handleBorrow = async () => {
    if (asset && account) {
      setIsLoading(true);
      setSetting({
        pendingInfo: {
          type: 'Borrow',
          status: true,
          amount: amount.dp(8, 1).toString(10),
          symbol: asset.symbol
        }
      });
      try {
        await vbepContract.methods
          .borrow(
            amount
              .times(new BigNumber(10).pow(asset.decimals))
              .integerValue()
              .toString(10)
          )
          .send({ from: account });
        setAmount(new BigNumber(0));
        onCancel();
      } catch (error) {
        console.log('borrow error :>> ', error);
      }
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
  };
  /**
   * Max amount
   */
  const handleMaxAmount = () => {
    const tokenPrice = getBigNumber(asset.tokenPrice);
    const safeMax = BigNumber.maximum(
      userTotalBorrowLimit
        .times(40)
        .div(100)
        .minus(userTotalBorrowBalance),
      new BigNumber(0)
    );
    setAmount(BigNumber.minimum(safeMax, asset.liquidity).div(tokenPrice));
  };

  return (
    <TabSection>
      <div className="flex flex-column align-center just-center body-content">
        <div className="flex align-center input-wrapper">
          <NumberFormat
            autoFocus
            value={amount.isZero() ? '0' : amount.toString(10)}
            onValueChange={values => {
              const { value } = values;
              setAmount(new BigNumber(value));
            }}
            isAllowed={({ value }) => {
              return new BigNumber(value || 0)
                .plus(userTotalBorrowBalance)
                .isLessThanOrEqualTo(userTotalBorrowLimit);
            }}
            thousandSeparator
            allowNegative={false}
            placeholder="0"
          />
          <span className="pointer max" onClick={() => handleMaxAmount()}>
            SAFE MAX
          </span>
        </div>
      </div>
      <Tabs className="flex align-center">
        <div
          className="flex align-center just-center tab-item pointer tab-active"
          onClick={() => {
            changeTab('borrow');
          }}
        >
          Borrow
        </div>
        <div
          className="flex align-center just-center tab-item pointer"
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
            <span>{formatApy(asset.xvsBorrowApy)}</span>
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
            <span>{userVaiMinted.dp(2, 1).toString(10)} VAI</span>
          </div>
          {!new BigNumber(asset.borrowCaps || 0).isZero() && (
            <div className="description borrow-caps">
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
                <span>Borrow Caps</span>
              </div>
              <span>
                {format(
                  new BigNumber(asset.borrowCaps || 0).dp(2, 1).toString(10)
                )}
              </span>
            </div>
          )}
        </div>
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
            percent={newBorrowPercent.toNumber()}
            strokeColor="#d99d43"
            strokeWidth={7}
            showInfo={false}
          />
        </div>
        <Button
          className="button"
          disabled={
            isLoading ||
            amount.isZero() ||
            amount.isNaN() ||
            amount.isGreaterThan(asset.liquidity.div(asset.tokenPrice)) ||
            newBorrowPercent.isGreaterThan(100) ||
            (!new BigNumber(asset.borrowCaps || 0).isZero() &&
              amount.plus(asset.totalBorrows).isGreaterThan(asset.borrowCaps))
          }
          onClick={handleBorrow}
        >
          {isLoading && <Icon type="loading" />} Borrow
        </Button>
        <div className="description">
          <span>Protocol Balance</span>
          <span>
            {asset.borrowBalance &&
              format(asset.borrowBalance.dp(2, 1).toString(10))}{' '}
            {asset.symbol}
          </span>
        </div>
      </TabContent>
    </TabSection>
  );
}

BorrowTab.propTypes = {
  asset: PropTypes.object,
  changeTab: PropTypes.func,
  onCancel: PropTypes.func,
  setSetting: PropTypes.func.isRequired
};

BorrowTab.defaultProps = {
  asset: {},
  changeTab: () => {},
  onCancel: () => {}
};

const mapDispatchToProps = dispatch => {
  const { setSetting } = accountActionCreators;

  return bindActionCreators(
    {
      setSetting
    },
    dispatch
  );
};

export default compose(connectAccount(null, mapDispatchToProps))(BorrowTab);
