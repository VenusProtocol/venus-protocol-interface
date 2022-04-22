/** @jsxImportSource @emotion/react */
import React from 'react';

import { useIsSmDown, useIsXlDown } from 'hooks/responsive';
import { Tabs } from 'components';
import { useTranslation } from 'translation';
import MyAccount from './MyAccount';
import MintRepayVai from './MintRepayVai';
import { SupplyMarket, BorrowMarket } from './Markets';
import { useStyles } from './styles';

const DashboardMarketsUi: React.FC = () => {
  const { t } = useTranslation();
  const isXlDown = useIsXlDown();
  const isSmDown = useIsSmDown();
  const styles = useStyles();

  if (isXlDown) {
    const tabsContent = [
      {
        title: t('dashboard.markets.tabSupply'),
        content: <SupplyMarket css={styles.item} />,
      },
      {
        title: t('dashboard.markets.tabBorrow'),
        content: <BorrowMarket css={styles.item} />,
      },
    ];

    return (
      <div css={styles.tabsWrapper}>
        {isSmDown && (
          <h4 css={[styles.tabsHeader, styles.tabsTitle]}>{t('dashboard.markets.title')}</h4>
        )}
        <Tabs
          css={styles.tabsHeader}
          componentTitle={isSmDown ? undefined : t('dashboard.markets.title')}
          tabsContent={tabsContent}
        />
      </div>
    );
  }

  return (
    <div css={styles.container}>
      <SupplyMarket css={styles.item} />
      <BorrowMarket css={styles.item} />
    </div>
  );
};

const DashboardUi: React.FC = () => {
  const styles = useStyles();

  return (
    <>
      <div css={styles.container}>
        <MyAccount css={styles.item} />
        <MintRepayVai css={styles.item} />
      </div>
      <DashboardMarketsUi />
    </>
  );
};

export default DashboardUi;
