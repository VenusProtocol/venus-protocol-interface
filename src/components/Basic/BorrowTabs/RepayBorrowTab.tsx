import React, { useEffect, useState, useCallback, useContext } from 'react';
import BigNumber from 'bignumber.js';
import NumberFormat from 'react-number-format';

import { PrimaryButton } from 'components';
import { connectAccount } from 'core';
import { sendRepay } from 'utilities/BnbContract';
import arrowRightImg from 'assets/img/arrow-right.png';
import coinImg from 'assets/img/coins/xvs.svg';
import vaiImg from 'assets/img/coins/vai.svg';
import { Progress } from 'antd';
import { TabSection, Tabs, TabContent } from 'components/Basic/BorrowModal';
import { getBigNumber, formatToReadablePercentage, format } from 'utilities/common';
import { Asset, Setting, VTokenId } from 'types';
import { State } from 'core/modules/initialState';
import { useWeb3 } from 'clients/web3';
import { useVaiUser } from 'hooks/useVaiUser';
import { useMarketsUser } from 'hooks/useMarketsUser';
import { useTokenContract, useVTokenContract } from 'clients/contracts/hooks';
import { AuthContext } from 'context/AuthContext';

interface DispatchProps {
  setSetting: (setting: Setting | undefined) => void;
}

interface Props {
  asset: Asset;
  changeTab: (tab: 'borrow' | 'repayBorrow') => void;
  onCancel: () => void;
}

function RepayBorrowTab({ asset, changeTab, onCancel, setSetting }: Props & DispatchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const [borrowBalance, setBorrowBalance] = useState(new BigNumber(0));
  const [borrowPercent, setBorrowPercent] = useState(new BigNumber(0));
  const [newBorrowBalance, setNewBorrowBalance] = useState(new BigNumber(0));
  const [newBorrowPercent, setNewBorrowPercent] = useState(new BigNumber(0));
  const { account } = useContext(AuthContext);
  const { userVaiMinted } = useVaiUser();
  const { userTotalBorrowBalance, userTotalBorrowLimit } = useMarketsUser();
  const tokenContract = useTokenContract(asset.id);
  const vbepContract = useVTokenContract(asset.id as VTokenId);
  const web3 = useWeb3();

  const updateInfo = useCallback(() => {
    const tokenPrice = getBigNumber(asset.tokenPrice);
    if (amount.isZero() || amount.isNaN()) {
      setBorrowBalance(userTotalBorrowBalance);
      if (userTotalBorrowLimit.isZero()) {
        setBorrowPercent(new BigNumber(0));
        setNewBorrowPercent(new BigNumber(0));
      } else {
        setBorrowPercent(userTotalBorrowBalance.div(userTotalBorrowLimit).times(100));
        setNewBorrowPercent(userTotalBorrowBalance.div(userTotalBorrowLimit).times(100));
      }
    } else {
      const temp = userTotalBorrowBalance.minus(amount.times(tokenPrice));
      setBorrowBalance(userTotalBorrowBalance);
      setNewBorrowBalance(temp);
      if (userTotalBorrowLimit.isZero()) {
        setBorrowPercent(new BigNumber(0));
        setNewBorrowPercent(new BigNumber(0));
      } else {
        setBorrowPercent(userTotalBorrowBalance.div(userTotalBorrowLimit).times(100));
        setNewBorrowPercent(temp.div(userTotalBorrowLimit).times(100));
      }
    }
  }, [amount, asset, userTotalBorrowBalance, userTotalBorrowLimit]);

  useEffect(() => {
    if (account) {
      updateInfo();
    }
  }, [account, updateInfo, asset]);

  /**
   * Approve underlying token
   */
  const onApprove = async () => {
    if (asset && account && asset.id !== 'bnb') {
      setIsLoading(true);
      try {
        await tokenContract.methods
          .approve(asset.vtokenAddress, new BigNumber(2).pow(256).minus(1).toString(10))
          .send({ from: account.address });
        setIsEnabled(true);
      } catch (error) {
        console.log('approve error :>> ', error);
      }
      setIsLoading(false);
    }
  };
  /**
   * Repay Borrow
   */
  const handleRepayBorrow = async () => {
    if (asset && account) {
      setIsLoading(true);
      setSetting({
        pendingInfo: {
          type: 'Repay Borrow',
          status: true,
          amount: amount.dp(8, 1).toString(10),
          symbol: asset.symbol,
        },
      });
      if (asset.id !== 'bnb') {
        const repayAmount = amount.eq(asset.borrowBalance)
          ? new BigNumber(2).pow(256).minus(1).toString(10)
          : amount.times(new BigNumber(10).pow(asset.decimals)).integerValue().toString(10);
        try {
          await vbepContract.methods.repayBorrow(repayAmount).send({ from: account.address });
          setAmount(new BigNumber(0));
          onCancel();
        } catch (error) {
          console.log('repay borrow error :>> ', error);
        }
        setIsLoading(false);
        setSetting({
          pendingInfo: {
            type: '',
            status: false,
            amount: '0',
            symbol: '',
          },
        });
      } else {
        sendRepay(
          web3,
          account,
          amount.times(new BigNumber(10).pow(asset.decimals)).integerValue().toString(10),
          () => {
            setAmount(new BigNumber(0));
            setIsLoading(false);
            onCancel();
            setSetting({
              pendingInfo: {
                type: '',
                status: false,
                amount: '0',
                symbol: '',
              },
            });
          },
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
              isAllowed={({ value }) =>
                new BigNumber(value || 0).isLessThanOrEqualTo(
                  BigNumber.minimum(asset.walletBalance, asset.borrowBalance),
                )
              }
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
              To Repay {asset.symbol} to the Venus Protocol, you need to enable it first.
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
                  marginRight: 16,
                }}
                src={coinImg}
                alt="asset"
              />
              <span>Distribution APY</span>
            </div>
            <span>{formatToReadablePercentage(asset.xvsBorrowApy)}</span>
          </div>
          <div className="description">
            <div className="flex align-center">
              <img
                style={{
                  width: 25,
                  height: 25,
                  marginLeft: 2,
                  marginRight: 16,
                }}
                src={vaiImg}
                alt="asset"
              />
              <span>Repay VAI Balance</span>
            </div>
            <span>{userVaiMinted.dp(2, 1).toString(10)} VAI</span>
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
                  <img className="arrow-right-img" src={arrowRightImg} alt="arrow" />
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
                  <img className="arrow-right-img" src={arrowRightImg} alt="arrow" />
                  <span>{newBorrowPercent.dp(2, 1).toString(10)}%</span>
                </div>
              )}
            </div>
            <Progress
              percent={newBorrowPercent.toNumber()}
              strokeColor="var(--color-blue-hover)"
              strokeWidth={7}
              showInfo={false}
            />
          </div>
        )}
        {!isEnabled && asset.id !== 'bnb' ? (
          <PrimaryButton
            className="button"
            disabled={isLoading}
            onClick={() => {
              onApprove();
            }}
            loading={isLoading}
          >
            Enable
          </PrimaryButton>
        ) : (
          <PrimaryButton
            className="button"
            disabled={
              isLoading ||
              amount.isZero() ||
              amount.isNaN() ||
              amount.isGreaterThan(BigNumber.minimum(asset.walletBalance, asset.borrowBalance))
            }
            onClick={handleRepayBorrow}
            loading={isLoading}
          >
            Repay Borrow
          </PrimaryButton>
        )}
        <div className="description">
          <span>Wallet Balance</span>
          <span>
            {format(asset.walletBalance)} {asset.symbol}
          </span>
        </div>
      </TabContent>
    </TabSection>
  );
}

RepayBorrowTab.defaultProps = {
  changeTab: () => {},
  onCancel: () => {},
};

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connectAccount(mapStateToProps)(RepayBorrowTab);
