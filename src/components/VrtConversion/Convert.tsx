import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import NumberFormat from 'react-number-format';
import Typography from '@mui/material/Typography';
import { PrimaryButton, Icon } from 'components';
import { commaFormat } from 'utilities/common';

import { ConvertWrapper } from './styles';

import vrtImg from '../../assets/img/coins/vrt.svg';
import xvsImg from '../../assets/img/coins/xvs.svg';

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

export type ConvertPropsType = {
  userVrtBalance: BigNumber;
  userEnabled: boolean;
  conversionEndTime: BigNumber;
  conversionRatio: BigNumber;
  account: string;
  handleClickConvert: (convertAmount: BigNumber) => void;
};

export default ({
  userVrtBalance,
  userEnabled,
  conversionEndTime,
  conversionRatio,
  account,
  handleClickConvert,
}: ConvertPropsType) => {
  const [convertInputAmount, setConvertInputAmount] = useState(new BigNumber(0));
  const [convertLoading, setConvertLoading] = useState(false);

  let confirmButtonText = '';
  if (!account) {
    confirmButtonText = 'Connect';
  } else if (userEnabled) {
    confirmButtonText = 'Convert';
  } else {
    confirmButtonText = 'Enable';
  }

  return (
    <ConvertWrapper>
      {/* text about convert ratio */}
      <div className="ratio-text">
        Convert <span>1</span> VRT for <span>{conversionRatio.toFixed(6)}</span> XVS
      </div>
      <Typography component="p" variant="small1" className="info-banner">
        Deposited VRT converts into XVS over a gradual 1 year vesting period (12,000 VRT / 1 XVS).
      </Typography>
      {/* convert section */}
      <div className="convert-vrt">
        <div className="input-title">Convert VRT</div>
        <div className="input-wrapper">
          <img src={vrtImg} alt="vrt-icon" />
          <NumberFormat
            className="input convert-vrt-input"
            autoFocus
            value={convertInputAmount.toFixed(4)}
            onValueChange={values => {
              const { value } = values;
              setConvertInputAmount(BigNumber.min(new BigNumber(value), userVrtBalance));
            }}
            thousandSeparator
            allowNegative={false}
            placeholder="0"
          />
          <PrimaryButton
            className="button max-button"
            onClick={() => {
              setConvertInputAmount(userVrtBalance);
            }}
          >
            {' '}
            Max
          </PrimaryButton>
        </div>
        <div className="user-vrt-balance">
          Balance:
          {account ? commaFormat(userVrtBalance.toFixed(4)) : '-'} VRT
        </div>
      </div>
      {/* recieve section */}
      <div className="recieve-xvs">
        <div className="input-title">You will receive</div>
        <div className="input-wrapper">
          <img src={xvsImg} alt="xvs-icon" />
          <NumberFormat
            className="input recieve-xvs-input"
            value={convertInputAmount.times(conversionRatio).toFixed(6)}
            disabled
            thousandSeparator
            placeholder="0"
          />
          <span className="recieve-xvs-symbol">XVS</span>
        </div>
      </div>
      <PrimaryButton
        type="button"
        fullWidth
        loading={convertLoading}
        disabled={
          !convertInputAmount.gt(0) ||
          conversionEndTime.lt(Date.now() / 1000) ||
          !account ||
          convertLoading
        }
        onClick={async () => {
          setConvertLoading(true);
          await handleClickConvert(convertInputAmount);
          setConvertLoading(false);
          setConvertInputAmount(new BigNumber(0));
        }}
      >
        {confirmButtonText}
      </PrimaryButton>
      <div className="remaining-days">
        <Icon className="clock-icon" name="countdown" />
        <span className="remaining-cap-text">Remaining time: </span>
        <span className="remaining-time-text">
          {formatCountdownInSeconds(Math.floor(Number(conversionEndTime.minus(Date.now() / 1000))))}{' '}
        </span>
      </div>
    </ConvertWrapper>
  );
};
