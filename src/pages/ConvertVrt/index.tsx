/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import BigNumber from 'bignumber.js';
import { Spinner, Tabs } from 'components';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { convertWeiToTokens } from 'utilities';

import {
  useGetVrtConversionEndTime,
  useGetVrtConversionRatio,
  useGetXvsWithdrawableAmount,
  useWithdrawXvs,
} from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';
import { VError } from 'errors/VError';

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
  const { account } = useContext(AuthContext);
  const accountAddress = account?.address;
  const { data: vrtConversionEndTimeData } = useGetVrtConversionEndTime();
  const { data: vrtConversionRatioData } = useGetVrtConversionRatio();

  const { data: { totalWithdrawableAmount: xvsWithdrawableAmount } = {} } =
    useGetXvsWithdrawableAmount(
      { accountAddress: accountAddress || '' },
      { enabled: !!accountAddress },
    );

  const { mutateAsync: withdrawXvs, isLoading: withdrawXvsLoading } = useWithdrawXvs();

  const handleWithdrawXvs = async () => {
    if (!accountAddress) {
      throw new VError({ type: 'unexpected', code: 'walletNotConnected' });
    }

    return withdrawXvs({
      accountAddress,
    });
  };

  const conversionRatio = useMemo(() => {
    if (vrtConversionRatioData?.conversionRatio) {
      return convertWeiToTokens({
        valueWei: new BigNumber(vrtConversionRatioData.conversionRatio),
        token: TOKENS.xvs,
      });
    }

    return undefined;
  }, [vrtConversionRatioData?.conversionRatio]);

  if (conversionRatio && vrtConversionEndTimeData?.conversionEndTime) {
    return (
      <ConvertVrtUi
        withdrawXvs={handleWithdrawXvs}
        withdrawXvsLoading={withdrawXvsLoading}
        xvsWithdrawableAmount={xvsWithdrawableAmount}
      />
    );
  }

  // @TODO - Handle error state
  return <Spinner />;
};

export default ConvertVrt;
