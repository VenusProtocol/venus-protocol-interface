/** @jsxImportSource @emotion/react */
import React from 'react';

import { useIsSmDown } from 'hooks/responsive';
import { Tabs } from 'components';
import { useTranslation } from 'translation';
import MintVai from './MintVai';
import RepayVai from './RepayVai';
import { useStyles } from './styles';

export interface IMintRepayVaiProps {
  className?: string;
}

const MintRepayVai: React.FC<IMintRepayVaiProps> = ({ className }) => {
  const styles = useStyles();
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const { t } = useTranslation();
  const isOnMobile = useIsSmDown();

  return (
    <div className={className} css={styles.container}>
      <div css={styles.header}>
        <div css={[styles.headerColumn, styles.headerTitle]}>
          <h4>{t('mintRepayVai.title')}</h4>
        </div>

        <div css={[styles.headerColumn, styles.headerTabsContainer]}>
          <Tabs
            fullWidth={isOnMobile}
            tabTitles={[t('mintRepayVai.tabMint'), t('mintRepayVai.tabRepay')]}
            activeTabIndex={activeTabIndex}
            onChange={tabIndex => setActiveTabIndex(tabIndex)}
          />
        </div>
      </div>

      {activeTabIndex === 0 ? <MintVai /> : <RepayVai />}
    </div>
  );
};

export default MintRepayVai;
