/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import Paper from '@mui/material/Paper';

import { AuthContext } from 'context/AuthContext';
import {
  useGetAllowance,
  useGetBalanceOf,
  useGetVrtConversionEndTime,
  useGetVrtConversionRatio,
  useGetXvsWithdrawableAmount,
  useConvertVrt,
  useWithdrawXvs,
} from 'clients/api';
import { Tabs } from 'components';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { getContractAddress } from 'utilities';
import { UiError } from 'utilities/errors';
import { useTranslation } from 'translation';
import { CONVERSION_RATIO_DECIMAL, VRT_ID } from './constants';
import Withdraw, { IWithdrawProps } from './Withdraw';
import Convert, { IConvertProps } from './Convert';
import { useStyles } from './styles';

export type ConvertVrtUiProps = IConvertProps & IWithdrawProps;

export const ConvertVrtUi = ({
  xvsToVrtConversionRatio,
  vrtConversionEndTime,
  walletConnected,
  userVrtBalanceWei,
  userVrtEnabled,
  vrtConversionLoading,
  convertVrt,
  xvsWithdrawlLoading,
  withdrawXvs,
  xvsWithdrawableAmount,
}: ConvertVrtUiProps) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const tabsContent = [
    {
      title: t('convertVrt.convert'),
      content: (
        <Convert
          xvsToVrtConversionRatio={xvsToVrtConversionRatio}
          vrtConversionEndTime={vrtConversionEndTime}
          walletConnected={walletConnected}
          userVrtBalanceWei={userVrtBalanceWei}
          userVrtEnabled={userVrtEnabled}
          vrtConversionLoading={vrtConversionLoading}
          convertVrt={convertVrt}
        />
      ),
    },
    {
      title: t('convertVrt.withdraw'),
      content: (
        <Withdraw
          xvsWithdrawableAmount={xvsWithdrawableAmount}
          xvsWithdrawlLoading={xvsWithdrawlLoading}
          withdrawXvs={withdrawXvs}
        />
      ),
    },
  ];

  return (
    <div css={[styles.root, styles.marginTop]}>
      <Paper css={styles.tabs}>
        <Tabs tabsContent={tabsContent} />
      </Paper>
    </div>
  );
};

const ConvertVrt = () => {
  const { account } = useContext(AuthContext);
  const { t } = useTranslation();
  const accountAddress = account?.address;
  const { data: vrtConversionEndTime } = useGetVrtConversionEndTime();
  const { data: vrtConversionRatio } = useGetVrtConversionRatio();
  const { data: userVrtAllowance } = useGetAllowance(
    {
      tokenId: VRT_ID,
      accountAddress: accountAddress || '',
      spenderAddress: getContractAddress('vrtConverterProxy'),
    },
    { enabled: !!accountAddress },
  );
  const { data: userVrtBalanceWei } = useGetBalanceOf(
    { accountAddress: accountAddress || '', tokenId: VRT_ID },
    { enabled: !!accountAddress },
  );
  const { data: xvsVestedBalanceWei } = useGetBalanceOf(
    { accountAddress: getContractAddress('xvsVestingProxy'), tokenId: 'xvs' },
    { enabled: !!accountAddress },
  );
  const { data: { totalWithdrawableAmount: xvsWithdrawableAmount } = {} } =
    useGetXvsWithdrawableAmount(
      { accountAddress: accountAddress || '' },
      { enabled: !!accountAddress },
    );

  const { mutateAsync: convertVrt, isLoading: vrtConversionLoading } = useConvertVrt();
  const { mutateAsync: withdrawXvs, isLoading: xvsWithdrawlLoading } = useWithdrawXvs();
  const userVrtEnabled = new BigNumber(userVrtAllowance || 0).gt(0);

  const handleConvertVrt = async (amount: string) => {
    if (!accountAddress) {
      throw new UiError(t('errors.walletNotConnected'));
    }
    const res = await convertVrt({
      amountWei: amount,
      accountAddress,
    });
    return res.transactionHash;
  };

  const handleWithdrawXvs = async () => {
    if (!accountAddress) {
      throw new UiError(t('errors.walletNotConnected'));
    }
    const res = await withdrawXvs({
      accountAddress,
    });
    return res.transactionHash;
  };

  const conversionRatio = useMemo(() => {
    if (vrtConversionRatio) {
      return new BigNumber(vrtConversionRatio).div(CONVERSION_RATIO_DECIMAL);
    }
    return undefined;
  }, [vrtConversionRatio]);
  if (conversionRatio && userVrtBalanceWei && vrtConversionEndTime && xvsVestedBalanceWei) {
    return (
      <ConvertVrtUi
        walletConnected={!!accountAddress}
        xvsToVrtConversionRatio={conversionRatio}
        userVrtBalanceWei={new BigNumber(userVrtBalanceWei)}
        vrtConversionEndTime={vrtConversionEndTime}
        vrtConversionLoading={vrtConversionLoading}
        userVrtEnabled={userVrtEnabled}
        convertVrt={handleConvertVrt}
        withdrawXvs={handleWithdrawXvs}
        xvsWithdrawlLoading={xvsWithdrawlLoading}
        xvsWithdrawableAmount={xvsWithdrawableAmount}
      />
    );
  }
  return <LoadingSpinner />;
};

export default ConvertVrt;
