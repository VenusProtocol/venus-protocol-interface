import React, { useEffect, useState, useCallback, useContext } from 'react';
import BigNumber from 'bignumber.js';
import { Progress } from 'antd';
import NumberFormat from 'react-number-format';

import { PrimaryButton } from 'components';
import { connectAccount } from 'core';
import { useWeb3 } from 'clients/web3';
import { sendSupply } from 'utilities/BnbContract';
import coinImg from 'assets/img/coins/xvs.svg';
import arrowRightImg from 'assets/img/arrow-right.png';
import vaiImg from 'assets/img/coins/vai.svg';
import { TabSection, Tabs, TabContent } from 'components/Basic/SupplyModal';
import { getBigNumber, format, convertCoinsToWei } from 'utilities/common';
import { Asset, Setting, VTokenId } from 'types';
import { useTokenContract, useVTokenContract } from 'clients/contracts/hooks';
import { AuthContext } from 'context/AuthContext';
import { useMarketsUser } from 'hooks/useMarketsUser';
import { useVaiUser } from 'hooks/useVaiUser';
import { calculateCollateralValue } from 'utilities';

interface SupplyTabProps {
  asset: Asset;
  changeTab: (tab: 'supply' | 'withdraw') => void;
  onCancel: () => void;
  setSetting: (setting: Partial<Setting> | undefined) => void;
}

function SupplyTab({ asset, changeTab, onCancel, setSetting }: SupplyTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const [borrowLimit, setBorrowLimit] = useState(new BigNumber(0));
  const [borrowPercent, setBorrowPercent] = useState(new BigNumber(0));
  const [newBorrowLimit, setNewBorrowLimit] = useState(new BigNumber(0));
  const [newBorrowPercent, setNewBorrowPercent] = useState(new BigNumber(0));
  const { account } = useContext(AuthContext);
  const vbepContract = useVTokenContract(asset.id as VTokenId);
  const tokenContract = useTokenContract(asset.id);
  const { userTotalBorrowBalance, userTotalBorrowLimit } = useMarketsUser();
  const { mintableVai } = useVaiUser();
  const web3 = useWeb3();

  const updateInfo = useCallback(async () => {
    const tokenPrice = getBigNumber(asset.tokenPrice);

    if (tokenPrice && !amount.isZero() && !amount.isNaN()) {
      const collateralValue = calculateCollateralValue({
        amountWei: convertCoinsToWei({ value: amount, tokenId: asset.id }),
        asset,
      });
      const temp = userTotalBorrowLimit.plus(collateralValue);
      setNewBorrowLimit(BigNumber.maximum(temp, 0));
      setNewBorrowPercent(userTotalBorrowBalance.div(temp).times(100));
      if (userTotalBorrowLimit.isZero()) {
        setBorrowLimit(new BigNumber(0));
        setBorrowPercent(new BigNumber(0));
      } else {
        setBorrowLimit(userTotalBorrowLimit);
        setBorrowPercent(userTotalBorrowBalance.div(userTotalBorrowLimit).times(100));
      }
    } else if (BigNumber.isBigNumber(userTotalBorrowLimit)) {
      setBorrowLimit(userTotalBorrowLimit);
      setNewBorrowLimit(userTotalBorrowLimit);
      if (userTotalBorrowLimit.isZero()) {
        setBorrowPercent(new BigNumber(0));
        setNewBorrowPercent(new BigNumber(0));
      } else {
        setBorrowPercent(userTotalBorrowBalance.div(userTotalBorrowLimit).times(100));
        setNewBorrowPercent(userTotalBorrowBalance.div(userTotalBorrowLimit).times(100));
      }
    }
  }, [amount, asset, userTotalBorrowBalance, userTotalBorrowLimit]);

  useEffect(() => {
    setIsEnabled(asset.isEnabled);
  }, [asset.isEnabled]);

  /**
   * Get Allowed amount
   */
  useEffect(() => {
    if (asset.vtokenAddress && account) {
      updateInfo();
    }
  }, [account, updateInfo]);
  /**
   * Approve underlying token
   */
  const onApprove = useCallback(async () => {
    setIsLoading(true);
    try {
      await tokenContract.methods
        .approve(asset.vtokenAddress, new BigNumber(2).pow(256).minus(1).toString(10))
        .send({ from: account?.address });
      setIsEnabled(true);
    } catch (error) {
      console.log('approve error :>> ', error);
    }
    setIsLoading(false);
  }, [tokenContract, asset, account]);

  /**
   * Supply
   */
  const handleSupply = useCallback(async () => {
    setIsLoading(true);
    setSetting({
      pendingInfo: {
        type: 'Supply',
        status: true,
        amount: amount.dp(8, 1).toString(10),
        symbol: asset.symbol,
      },
    });
    if (asset.id !== 'bnb') {
      try {
        await vbepContract.methods
          .mint(amount.times(new BigNumber(10).pow(asset.decimals)).toString(10))
          .send({ from: account?.address });
        setAmount(new BigNumber(0));
        onCancel();
      } catch (error) {
        console.log('supply error :>> ', error);
      }
      setIsLoading(false);
      setSetting({
        pendingInfo: {
          type: '',
          status: false,
          amount: 0,
          symbol: '',
        },
      });
    } else {
      sendSupply(
        web3,
        account,
        amount.times(new BigNumber(10).pow(asset.decimals)).toString(10),
        () => {
          setAmount(new BigNumber(0));
          setIsLoading(false);
          setSetting({
            pendingInfo: {
              type: '',
              status: false,
              amount: 0,
              symbol: '',
            },
          });
          onCancel();
        },
      );
    }
  }, [vbepContract, amount, account, asset]);
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
              isAllowed={({ value }) =>
                new BigNumber(value || 0).isLessThanOrEqualTo(asset.walletBalance)
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
              To Supply {asset.symbol} to the Venus Protocol, you need to approve it first.
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
                  marginRight: 16,
                }}
                src={coinImg}
                alt="asset"
              />
              <span>Distribution APY</span>
            </div>
            <span>{getBigNumber(asset.xvsSupplyApy).dp(2, 1).toString(10)}%</span>
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
              <span>Available VAI Limit</span>
            </div>
            <span>{mintableVai.dp(2, 1).toString(10)} VAI</span>
          </div>
        </div>
        {isEnabled && (
          <div className="flex flex-column just-center align-center apy-content">
            <div className="borrow-limit">
              <span>Borrow Limit</span>
              {amount.isZero() || amount.isNaN() ? (
                <span>${format(borrowLimit)}</span>
              ) : (
                <div className="flex align-center just-between">
                  <span>${format(borrowLimit)}</span>
                  <img className="arrow-right-img" src={arrowRightImg} alt="arrow" />
                  <span>${format(newBorrowLimit)}</span>
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
            fullWidth
            disabled={isLoading || !account}
            onClick={() => {
              onApprove();
            }}
            loading={isLoading}
          >
            Enable
          </PrimaryButton>
        ) : (
          <PrimaryButton
            fullWidth
            className="button"
            disabled={
              isLoading ||
              !account ||
              amount.isNaN() ||
              amount.isZero() ||
              amount.isGreaterThan(asset.walletBalance)
            }
            onClick={handleSupply}
            loading={isLoading}
          >
            Supply
          </PrimaryButton>
        )}
        <div className="description">
          <span>Wallet Balance</span>
          <span>
            {format(asset.walletBalance, 2)} {asset.symbol}
          </span>
        </div>
      </TabContent>
    </TabSection>
  );
}

export default connectAccount()(SupplyTab);
