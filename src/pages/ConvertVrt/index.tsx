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
  xvsTotal: BigNumber;
  xvsToVrtRate: BigNumber;
  vrtLimitUsed: number;
  vrtLimit: number;
  vestingTime: number;
}

export const ConvertVrtUi = ({
  xvsTotal,
  xvsToVrtRate,
  vrtLimitUsed,
  vrtLimit,
  vestingTime,
}: ConvertVrtUiProps) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const tabsContent = [
    {
      title: t('convertVrt.convert'),
      content: (
        <Convert
          xvsTotal={xvsTotal}
          xvsToVrtRate={xvsToVrtRate}
          vrtLimitUsed={vrtLimitUsed}
          vrtLimit={vrtLimit}
          vestingTime={vestingTime}
        />
      ),
    },
    { title: t('convertVrt.withdraw'), content: <Withdraw xvsTotal={xvsTotal} /> },
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
  // @TODO Wire up https://app.clickup.com/t/296pa55
  <ConvertVrtUi
    xvsTotal={new BigNumber('120497')}
    xvsToVrtRate={new BigNumber('0.000083')}
    vrtLimitUsed={300}
    vrtLimit={1000}
    vestingTime={2}
  />
);

export default ConvertVrt;
