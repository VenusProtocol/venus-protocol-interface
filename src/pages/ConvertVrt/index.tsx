/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import Paper from '@mui/material/Paper';

import { AuthContext } from 'context/AuthContext';
import {
  useGetBalanceOf,
  useGetVrtConversionEndTime,
  useGetVrtConversionRatio,
  useGetXvsWithdrawableAmount,
  useConvertVrt,
  useWithdrawXvs,
} from 'clients/api';
import { Tabs } from 'components';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { UiError } from 'utilities/errors';
import { useTranslation } from 'translation';
import { convertWeiToCoins } from 'utilities/common';
import { VRT_ID, XVS_ID } from './constants';
import Withdraw, { IWithdrawProps } from './Withdraw';
import Convert, { IConvertProps } from './Convert';
import { useStyles } from './styles';

export type ConvertVrtUiProps = IConvertProps & IWithdrawProps;

export const ConvertVrtUi = ({
  xvsToVrtConversionRatio,
  vrtConversionEndTime,
  userVrtBalanceWei,
  convertVrtLoading,
  convertVrt,
  withdrawXvsLoading,
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
          userVrtBalanceWei={userVrtBalanceWei}
          convertVrtLoading={convertVrtLoading}
          convertVrt={convertVrt}
        />
      ),
    },
    {
      title: t('convertVrt.withdraw'),
      content: (
        <Withdraw
          xvsWithdrawableAmount={xvsWithdrawableAmount}
          withdrawXvsLoading={withdrawXvsLoading}
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
  const { data: userVrtBalanceWei } = useGetBalanceOf(
    { accountAddress: accountAddress || '', tokenId: VRT_ID },
    { enabled: !!accountAddress },
  );

  const { data: { totalWithdrawableAmount: xvsWithdrawableAmount } = {} } =
    useGetXvsWithdrawableAmount(
      { accountAddress: accountAddress || '' },
      { enabled: !!accountAddress },
    );

  const { mutateAsync: convertVrt, isLoading: convertVrtLoading } = useConvertVrt();
  const { mutateAsync: withdrawXvs, isLoading: withdrawXvsLoading } = useWithdrawXvs();

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
      return convertWeiToCoins({
        valueWei: new BigNumber(vrtConversionRatio),
        tokenId: XVS_ID,
      });
    }
    return undefined;
  }, [vrtConversionRatio]);
  if (conversionRatio && vrtConversionEndTime) {
    return (
      <ConvertVrtUi
        xvsToVrtConversionRatio={conversionRatio}
        userVrtBalanceWei={userVrtBalanceWei}
        vrtConversionEndTime={vrtConversionEndTime}
        convertVrtLoading={convertVrtLoading}
        convertVrt={handleConvertVrt}
        withdrawXvs={handleWithdrawXvs}
        withdrawXvsLoading={withdrawXvsLoading}
        xvsWithdrawableAmount={xvsWithdrawableAmount}
      />
    );
  }
  // @TODO - Handle error state
  return <LoadingSpinner />;
};

export default ConvertVrt;
