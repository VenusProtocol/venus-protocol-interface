import React, { useEffect, useState, useCallback, useContext } from 'react';
import BigNumber from 'bignumber.js';
import NumberFormat from 'react-number-format';
import { Progress } from 'antd';

import { PrimaryButton } from 'components';
import { connectAccount } from 'core';
import { Asset, Setting, VTokenId } from 'types';
import coinImg from 'assets/img/coins/xvs.svg';
import arrowRightImg from 'assets/img/arrow-right.png';
import vaiImg from 'assets/img/coins/vai.svg';
import feeImg from 'assets/img/fee.png';
import { TabSection, Tabs, TabContent } from 'components/Basic/SupplyModal';
import {
  getBigNumber,
  formatToReadablePercentage,
  format,
  convertCoinsToWei,
} from 'utilities/common';
import { useComptrollerContract, useVTokenContract } from 'clients/contracts/hooks';
import { AuthContext } from 'context/AuthContext';
import { useMarketsUser } from 'hooks/useMarketsUser';
import { useVaiUser } from 'hooks/useVaiUser';
import { calculateCollateralValue } from 'utilities';

interface WithdrawTabProps {
  asset: Asset;
  changeTab: (tab: 'supply' | 'withdraw') => void;
  onCancel: () => void;
  setSetting: (setting: Setting | undefined) => void;
}

function WithdrawTab({ asset, changeTab, onCancel, setSetting }: WithdrawTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const [borrowLimit, setBorrowLimit] = useState(new BigNumber(0));
  const [borrowPercent, setBorrowPercent] = useState(new BigNumber(0));
  const [newBorrowLimit, setNewBorrowLimit] = useState(new BigNumber(0));
  const [newBorrowPercent, setNewBorrowPercent] = useState(new BigNumber(0));
  const [safeMaxBalance, setSafeMaxBalance] = useState(new BigNumber(0));
  const [feePercent, setFeePercent] = useState(new BigNumber(0));
  const { account } = useContext(AuthContext);
  const comptrollerContract = useComptrollerContract();
  const vbepContract = useVTokenContract(asset.id as VTokenId);
  const { userTotalBorrowBalance, userTotalBorrowLimit } = useMarketsUser();
  const { mintableVai } = useVaiUser();

  const getFeePercent = useCallback(async () => {
    const treasuryPercent = await comptrollerContract.methods.treasuryPercent().call();
    setFeePercent(new BigNumber(treasuryPercent).times(100).div(1e18));
  }, [comptrollerContract]);

  useEffect(() => {
    getFeePercent();
  }, [getFeePercent]);

  const updateInfo = useCallback(async () => {
    const tokenPrice = getBigNumber(asset.tokenPrice);
    const { collateral } = asset;
    const supplyBalance = getBigNumber(asset.supplyBalance);
    const collateralFactor = getBigNumber(asset.collateralFactor);
    if (!collateral) {
      setSafeMaxBalance(supplyBalance);
      return;
    }
    const safeMax = BigNumber.maximum(
      userTotalBorrowLimit
        .minus(userTotalBorrowBalance.div(40).times(100))
        .div(collateralFactor)
        .div(tokenPrice),
      new BigNumber(0),
    );
    setSafeMaxBalance(BigNumber.minimum(safeMax, supplyBalance));

    if (tokenPrice && !amount.isZero() && !amount.isNaN()) {
      const temp = userTotalBorrowLimit.minus(
        calculateCollateralValue({ amountWei: amount, asset }),
      );
      setNewBorrowLimit(temp);
      setNewBorrowPercent(userTotalBorrowBalance.div(temp).times(100));
      if (userTotalBorrowLimit.isZero()) {
        setBorrowLimit(new BigNumber(0));
        setBorrowPercent(new BigNumber(0));
      } else {
        setBorrowLimit(userTotalBorrowLimit);
        setBorrowPercent(userTotalBorrowBalance.div(userTotalBorrowLimit).times(100));
      }
    } else {
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
    if (asset.vtokenAddress && account) {
      updateInfo();
    }
  }, [updateInfo]);

  /**
   * Withdraw
   */
  const handleWithdraw = async () => {
    setIsLoading(true);
    setSetting({
      pendingInfo: {
        type: 'Withdraw',
        status: true,
        amount: amount.dp(8, 1).toString(10),
        symbol: asset.symbol,
      },
    });
    try {
      if (amount.eq(asset.supplyBalance) && account) {
        const vTokenBalance = await vbepContract.methods.balanceOf(account.address).call();
        await vbepContract.methods.redeem(vTokenBalance).send({ from: account.address });
      } else {
        await vbepContract.methods
          .redeemUnderlying(
            amount.times(new BigNumber(10).pow(asset.decimals)).integerValue().toString(10),
          )
          .send({ from: account?.address });
      }
      setAmount(new BigNumber(0));
      setIsLoading(false);
      onCancel();
      setSetting({
        pendingInfo: {
          type: '',
          status: false,
          amount: 0,
          symbol: '',
        },
      });
    } catch (error) {
      setIsLoading(false);
      setSetting({
        pendingInfo: {
          type: '',
          status: false,
          amount: 0,
          symbol: '',
        },
      });
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
              const { collateral } = asset;
              return (
                temp.isLessThanOrEqualTo(asset.supplyBalance) &&
                (!collateral ||
                  userTotalBorrowLimit.gte(
                    calculateCollateralValue({
                      amountWei: convertCoinsToWei({ value: temp, tokenId: asset.id }),
                      asset,
                    }),
                  ))
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
          Your available withdraw amount = Total Supply Amount - VAI Mint Amount - Borrowed Amount
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
                  marginRight: 16,
                }}
                src={coinImg}
                alt="asset"
              />
              <span>Distribution APY</span>
            </div>
            <span>{formatToReadablePercentage(asset.xvsSupplyApy)}</span>
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
          {asset.symbol !== 'BNB' && (
            <div className="description">
              <div className="flex align-center">
                <img
                  src={feeImg}
                  style={{
                    width: 25,
                    height: 25,
                    marginLeft: 2,
                    marginRight: 16,
                  }}
                  alt="fee"
                />
                <span>Fee</span>
              </div>
              <span>
                {!amount.isNaN()
                  ? new BigNumber(amount)
                      // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
                      .times(feePercent / 100)
                      .dp(4)
                      .toString(10)
                  : 0}{' '}
                {asset.symbol} ({feePercent.toString(10)}
                %)
              </span>
            </div>
          )}
        </div>
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

        <PrimaryButton
          fullWidth
          className="button"
          disabled={
            isLoading ||
            !account ||
            amount.isNaN() ||
            amount.isZero() ||
            amount.isGreaterThan(asset.supplyBalance) ||
            newBorrowPercent.isGreaterThan(new BigNumber(100))
          }
          onClick={handleWithdraw}
          loading={isLoading}
        >
          Withdraw
        </PrimaryButton>
        <div className="description">
          <span>Protocol Balance</span>
          <span>
            {format(asset.supplyBalance)} {asset.symbol}
          </span>
        </div>
      </TabContent>
    </TabSection>
  );
}

export default connectAccount(null)(WithdrawTab);
