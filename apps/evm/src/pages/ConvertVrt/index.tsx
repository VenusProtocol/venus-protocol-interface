/** @jsxImportSource @emotion/react */
import { Card } from 'components';
import { useMemo } from 'react';

import {
  useGetVrtConversionEndTime,
  useGetVrtConversionRatio,
  useGetXvsWithdrawableAmount,
  useWithdrawXvs,
} from 'clients/api';
import { Spinner, Tabs } from 'components';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { convertMantissaToTokens } from 'utilities';

import Convert from './Convert';
import Withdraw, { type WithdrawProps } from './Withdraw';
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
      <Card css={styles.tabs}>
        <Tabs tabsContent={tabsContent} />
      </Card>
    </div>
  );
};

const ConvertVrt = () => {
  const { accountAddress } = useAccountAddress();
  const { data: vrtConversionEndTimeData } = useGetVrtConversionEndTime();
  const { data: vrtConversionRatioData } = useGetVrtConversionRatio();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const {
    data: { totalWithdrawableAmount: xvsWithdrawableAmount } = {},
  } = useGetXvsWithdrawableAmount(
    { accountAddress: accountAddress || '' },
    { enabled: !!accountAddress },
  );

  const { mutateAsync: withdrawXvs, isPending: withdrawXvsLoading } = useWithdrawXvs();

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
