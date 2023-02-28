/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import BigNumber from 'bignumber.js';
import { Spinner, Tabs } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { convertWeiToTokens } from 'utilities';

import {
  useConvertVrt,
  useGetBalanceOf,
  useGetVrtConversionEndTime,
  useGetVrtConversionRatio,
  useGetXvsWithdrawableAmount,
  useWithdrawXvs,
} from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';

import Convert, { ConvertProps } from './Convert';
import Withdraw, { WithdrawProps } from './Withdraw';
import { useStyles } from './styles';

export type ConvertVrtUiProps = ConvertProps & WithdrawProps;

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
    <div css={[styles.root]}>
      <Paper css={styles.tabs}>
        <Tabs tabsContent={tabsContent} />
      </Paper>
    </div>
  );
};

const ConvertVrt = () => {
  const { accountAddress } = useAuth();
  const { data: vrtConversionEndTimeData } = useGetVrtConversionEndTime();
  const { data: vrtConversionRatioData } = useGetVrtConversionRatio();
  const { data: userVrtBalanceData } = useGetBalanceOf(
    { accountAddress: accountAddress || '', token: TOKENS.vrt },
    { enabled: !!accountAddress },
  );

  const { data: { totalWithdrawableAmount: xvsWithdrawableAmount } = {} } =
    useGetXvsWithdrawableAmount(
      { accountAddress: accountAddress || '' },
      { enabled: !!accountAddress },
    );

  const { mutateAsync: convertVrt, isLoading: convertVrtLoading } = useConvertVrt();
  const { mutateAsync: withdrawXvs, isLoading: withdrawXvsLoading } = useWithdrawXvs();

  const handleConvertVrt = async (amountWei: string) =>
    convertVrt({
      amountWei: new BigNumber(amountWei),
    });

  const conversionRatio = useMemo(() => {
    if (vrtConversionRatioData?.conversionRatio) {
      return convertWeiToTokens({
        valueWei: vrtConversionRatioData.conversionRatio,
        token: TOKENS.xvs,
      });
    }

    return undefined;
  }, [vrtConversionRatioData?.conversionRatio]);

  if (conversionRatio && vrtConversionEndTimeData?.conversionEndTime) {
    return (
      <ConvertVrtUi
        xvsToVrtConversionRatio={conversionRatio}
        userVrtBalanceWei={userVrtBalanceData?.balanceWei}
        vrtConversionEndTime={vrtConversionEndTimeData.conversionEndTime}
        convertVrtLoading={convertVrtLoading}
        convertVrt={handleConvertVrt}
        withdrawXvs={withdrawXvs}
        withdrawXvsLoading={withdrawXvsLoading}
        xvsWithdrawableAmount={xvsWithdrawableAmount}
      />
    );
  }

  // TODO - Handle error state
  return <Spinner />;
};

export default ConvertVrt;
