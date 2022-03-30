import React from 'react';
import { connect } from 'react-redux';
import AnimatedNumber from 'animated-number-react';
import commaNumber from 'comma-number';
import { State } from '../../../core/modules/initialState';
import { accountActionCreators } from '../../../core';
import { Setting } from '../../../types';
import { useWalletBalance } from '../../Dashboard/useWalletBalance';
import { MyAccount } from './index';
import { useBorrowLimit } from '../../Dashboard/useBorrowLimit';

interface IMyAccountWrapperProps {
  settings: Setting;
  setSetting: (setting: Partial<Setting> | undefined) => void;
}

const format = commaNumber.bindWith(',', '.');

const MyAccountWrapper = ({ settings, setSetting }: IMyAccountWrapperProps) => {
  const { totalSupply, formatValue, netAPY, withXVS, setWithXVS, totalBorrow } = useWalletBalance({
    settings,
    setSetting,
  });
  const { available, borrowPercent } = useBorrowLimit();
  return (
    <MyAccount
      key={borrowPercent}
      netApy={`${netAPY}%`}
      dailyEarnings="0"
      supplyBalance={
        <AnimatedNumber
          value={totalSupply.dp(2, 1).toString(10)}
          formatValue={formatValue}
          duration={2000}
        />
      }
      borrowBalance={
        <AnimatedNumber
          value={totalBorrow.dp(2, 1).toString(10)}
          formatValue={formatValue}
          duration={2000}
        />
      }
      borrowLimit={`${borrowPercent}%`}
      borrowLimitSum={`$${format(available)}`}
      safeLimit="0"
      isSwitched={withXVS}
      onSwitch={() => setWithXVS(!withXVS)}
      sliderProps={{
        onChange: console.log,
        defaultValue: borrowPercent,
        step: 1,
        mark: 80,
        ariaLabel: 'Borrow limit',
        min: 0,
        max: 100,
        isDisabled: true,
      }}
    />
  );
};

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connect(mapStateToProps, accountActionCreators)(MyAccountWrapper);
