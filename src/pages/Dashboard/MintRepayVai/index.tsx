/** @jsxImportSource @emotion/react */
import React from 'react';

import { useIsSmDown } from 'hooks/responsive';
import { Tabs } from 'components';
import MintVai from './MintVai';
import { useStyles } from './styles';

export interface IMintRepayVaiProps {
  className?: string;
}

export const MintRepayVai: React.FC<IMintRepayVaiProps> = ({ className }) => {
  const styles = useStyles();
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  const isOnMobile = useIsSmDown();

  return (
    <div className={className} css={styles.container}>
      <div css={[styles.row, styles.header]}>
        <div css={[styles.column, styles.headerTitle]}>
          <h4>Mint/Repay VAI</h4>
        </div>

        <div css={[styles.column, styles.headerTabsContainer]}>
          <Tabs
            fullWidth={isOnMobile}
            tabTitles={['Mint VAI', 'Repay VAI']}
            activeTabIndex={activeTabIndex}
            onChange={tabIndex => setActiveTabIndex(tabIndex)}
          />
        </div>
      </div>

      {/* TODO: add Repay component */}
      {activeTabIndex === 0 ? <MintVai /> : undefined}
    </div>
  );
};
