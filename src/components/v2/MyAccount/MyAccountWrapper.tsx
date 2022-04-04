import React from 'react';
import { connect } from 'react-redux';
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
  const { totalSupply, netAPY, withXVS, setWithXVS, totalBorrow } = useWalletBalance({
    settings,
    setSetting,
  });
  const { available, borrowPercent } = useBorrowLimit();
  return (
    <MyAccount
      key={borrowPercent}
      netApyPercentage={netAPY}
      dailyEarningsCents={0}
      supplyBalanceCents={+totalSupply}
      borrowBalanceCents={+format(available)}
      borrowLimitCents={+totalBorrow}
      safeLimitPercentage={0}
      borrowLimitUsedPercentage={borrowPercent}
      onSwitch={() => setWithXVS(!withXVS)}
      isSwitched={withXVS}
    />
  );
};

const mapStateToProps = ({ account }: State) => ({
  settings: account.setting,
});

export default connect(mapStateToProps, accountActionCreators)(MyAccountWrapper);
