import React, { useState } from 'react';
import { Progress, Icon } from 'antd';
import BigNumber from 'bignumber.js';
import NumberFormat from 'react-number-format';

import { ButtonWrapper, RedeemWrapper } from './styles';

import vrtImg from '../../assets/img/coins/vrt.svg';
import xvsImg from '../../assets/img/coins/xvs.png';

const SECONDS_PER_DAY = 86400;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;

// format the remaining time, if there is more than 1 day, only show
// how many days left. If there is less than 1 day, we should display
// the detail time
function formatCountdownInSeconds(seconds: number) {
  if (seconds >= SECONDS_PER_DAY) {
    return `${Math.floor(seconds / SECONDS_PER_DAY)} days`;
  }
  let res = seconds;
  const hours = Math.floor(res / SECONDS_PER_HOUR);
  res -= hours * SECONDS_PER_HOUR;
  const minutes = Math.floor(res / SECONDS_PER_MINUTE);
  res -= minutes * SECONDS_PER_MINUTE;
  const remainingSeconds = res;
  return `${hours} hours, ${minutes} minutes, ${remainingSeconds} seconds`;
}


export type RedeemPropsType = {
  vrtConverterXvsBalance: BigNumber,
  redeemableAmount: BigNumber,
  vrtConversionDailyLimit: BigNumber,
  vrtDailyUtilised: BigNumber,
  userVrtBalance: BigNumber,
  userEnabled: boolean,
  conversionEndTime: BigNumber,
  conversionRatio: BigNumber,
  account: string,
  handleClickRedeem: (redeemAmount: BigNumber) => void,
};

export default ({
  vrtConverterXvsBalance,
  redeemableAmount,
  vrtConversionDailyLimit,
  vrtDailyUtilised,
  userVrtBalance,
  userEnabled,
  conversionEndTime,
  conversionRatio,
  account,
  handleClickRedeem,
}: RedeemPropsType) => {
  const [redeemInputAmount, setRedeemInputAmount] = useState(new BigNumber(0));
  const [redeemLoading, setRedeemLoading] = useState(false);
  const maxRedeemableAmountRegardingXvsBalance = vrtConverterXvsBalance.div(
    conversionRatio,
  );

  let confirmButtonText = '';
  if (!account) {
    confirmButtonText = 'Connect';
  } else if (userEnabled) {
    confirmButtonText = 'Redeem';
  } else {
    confirmButtonText = 'Enable';
  }

  return (
    <RedeemWrapper>
      {/* text about redeem ratio */}
      <div className="ratio-text">
        Redeem 1 VRT for
        {conversionRatio.toFixed(6)}
        {' '}
        XVS
      </div>
      {/* display available XVS in pool */}
      <div className="xvs-pool">
        <div className="xvs-pool-line-1">
          {vrtConverterXvsBalance.toFixed(4)}
          {' '}
          XVS
        </div>
        <div className="xvs-pool-line-2">Current available</div>
      </div>

      {/* show the daily redeem limit */}
      <div className="redeem-daily-progress">
        <div className="redeem-daily-progress-title">
          <span>Daily limit</span>
          <span>
            {vrtDailyUtilised.toFixed(4)}
            /
            {vrtConversionDailyLimit.toFixed(4)}
            VRT
          </span>
        </div>
        <div className="redeem-daily-progress-bar">
          <Progress
            showInfo={false}
            strokeLinecap="square"
            trailColor="#090d27" // this doesn't work, idk why, have to put the style in CSS
            strokeColor="#ebbf6e"
            percent={vrtDailyUtilised
              .div(vrtConversionDailyLimit)
              .times(100)
              .toNumber()}
          />
        </div>
      </div>
      {/* redeem section */}
      <div className="redeem-vrt">
        <div className="input-title">Redeem VRT</div>
        <div className="input-wrapper">
          <img src={vrtImg} alt="vrt-icon" />
          <NumberFormat
            className="input redeem-vrt-input"
            autoFocus
            value={redeemInputAmount.toFixed(4)}
            onValueChange={values => {
              const { value } = values;
              setRedeemInputAmount(
                BigNumber.min(
                  new BigNumber(value),
                  userVrtBalance,
                  redeemableAmount,
                  maxRedeemableAmountRegardingXvsBalance,
                ),
              );
            }}
            thousandSeparator
            allowNegative={false}
            placeholder="0"
          />
          <ButtonWrapper>
            <div
              className="button max-button"
              onClick={() => {
                setRedeemInputAmount(
                  BigNumber.min(
                    userVrtBalance,
                    redeemableAmount,
                    maxRedeemableAmountRegardingXvsBalance,
                  ),
                );
              }}
            >
              {' '}
              Max
            </div>
          </ButtonWrapper>
        </div>
        <div className="user-vrt-balance">
          Balance:
          {account ? userVrtBalance.toFixed(4) : '-'}
          {' '}
          VRT
        </div>
      </div>
      {/* recieve section */}
      <div className="recieve-xvs">
        <div className="input-title">You will recieve</div>
        <div className="input-wrapper">
          <img src={xvsImg} alt="xvs-icon" />
          <NumberFormat
            className="input recieve-xvs-input"
            value={redeemInputAmount.times(conversionRatio).toFixed(4)}
            disabled
            thousandSeparator
            placeholder="0"
          />
          <span className="recieve-xvs-symbol">XVS</span>
        </div>
      </div>
      <ButtonWrapper>
        <button
          type="button"
          className="button confirm-button"
          disabled={
            !redeemInputAmount.gt(0) ||
            conversionEndTime.lt(Date.now() / 1000) ||
            !account ||
            redeemLoading
          }
          onClick={async () => {
            setRedeemLoading(true);
            await handleClickRedeem(redeemInputAmount);
            setRedeemLoading(false);
          }}
        >
          {redeemLoading && <Icon type="loading" />}
          {'  '}
          {confirmButtonText}
        </button>
      </ButtonWrapper>
      <div className="remaining-days">
        <Icon className="clock-icon" type="clock-circle" />
        <span className="remaining-cap-text">Remaining time: </span>
        <span className="remaining-time-text">
          {formatCountdownInSeconds(
            Math.floor(Number(conversionEndTime.minus(Date.now() / 1000))),
          )}
          {' '}
        </span>
      </div>
    </RedeemWrapper>
  );
};
