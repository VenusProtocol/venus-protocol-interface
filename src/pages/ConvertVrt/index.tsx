/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import Paper from '@mui/material/Paper';
import { Tabs } from 'components';
import { useTranslation } from 'translation';
import Withdraw from './Withdraw';
import Convert from './Convert';
import { useStyles } from './styles';

export interface ConvertVrtUiProps {
  xvsTotalWei: BigNumber;
  xvsToVrtRate: BigNumber;
  vrtLimitUsedWei: BigNumber;
  vrtLimitWei: BigNumber;
  vrtConversionEndTime: string | undefined;
  walletConnected: boolean;
}

export const ConvertVrtUi = ({
  xvsTotalWei,
  xvsToVrtRate,
  vrtLimitUsedWei,
  vrtLimitWei,
  vrtConversionEndTime,
  walletConnected,
}: ConvertVrtUiProps) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const tabsContent = [
    {
      title: t('convertVrt.convert'),
      content: (
        <Convert
          xvsTotalWei={xvsTotalWei}
          xvsToVrtRate={xvsToVrtRate}
          vrtLimitUsedWei={vrtLimitUsedWei}
          vrtLimitWei={vrtLimitWei}
          vrtConversionEndTime={vrtConversionEndTime}
          walletConnected={walletConnected}
        />
      ),
    },
    { title: t('convertVrt.withdraw'), content: <Withdraw xvsTotal={xvsTotalWei} /> },
  ];

  return (
    <div css={[styles.root, styles.marginTop]}>
      <Paper css={styles.tabs}>
        <Tabs tabsContent={tabsContent} />
      </Paper>
    </div>
  );
};

const ConvertVrt = () => (
  <ConvertVrtUi
    xvsTotalWei={new BigNumber('300000000000000000')}
    xvsToVrtRate={new BigNumber('00.0003')}
    vrtLimitUsedWei={new BigNumber(300)}
    vrtLimitWei={new BigNumber(1000)}
    vrtConversionEndTime="1678859525"
    walletConnected={false}
  />
);

export default ConvertVrt;
