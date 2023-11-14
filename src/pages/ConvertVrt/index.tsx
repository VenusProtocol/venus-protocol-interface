/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import { Spinner, Tabs } from 'components';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import React, { useMemo } from 'react';
import { convertMantissaToTokens } from 'utilities';

import {
  useGetVrtConversionEndTime,
  useGetVrtConversionRatio,
  useGetXvsWithdrawableAmount,
  useWithdrawXvs,
} from 'clients/api';
import { useAuth } from 'context/AuthContext';

import Convert from './Convert';
import Withdraw, { WithdrawProps } from './Withdraw';
import { useStyles } from './styles';

export type ConvertVrtUiProps = WithdrawProps;

export const ConvertVrtUi = ({
  withdrawXvsLoading,
  withdrawXvs,
  xvsWithdrawableAmount,
}: ConvertVrtUiProps) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const tabsContent = [
    {
      title: t('convertVrt.convert'),
      content: <Convert />,
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
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { data: { totalWithdrawableAmount: xvsWithdrawableAmount } = {} } =
    useGetXvsWithdrawableAmount(
      { accountAddress: accountAddress || '' },
      { enabled: !!accountAddress },
    );

  const { mutateAsync: withdrawXvs, isLoading: withdrawXvsLoading } = useWithdrawXvs();

  const conversionRatio = useMemo(() => {
    if (xvs && vrtConversionRatioData?.conversionRatio) {
      return convertMantissaToTokens({
        value: vrtConversionRatioData.conversionRatio,
        token: xvs,
      });
    }

    return undefined;
  }, [vrtConversionRatioData?.conversionRatio, xvs]);

  if (conversionRatio && vrtConversionEndTimeData?.conversionEndTime) {
    return (
      <ConvertVrtUi
        withdrawXvs={withdrawXvs}
        withdrawXvsLoading={withdrawXvsLoading}
        xvsWithdrawableAmount={xvsWithdrawableAmount}
      />
    );
  }

  // TODO: handle error state
  return <Spinner />;
};

export default ConvertVrt;
