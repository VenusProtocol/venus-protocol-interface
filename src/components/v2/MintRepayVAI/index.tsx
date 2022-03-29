/** @jsxImportSource @emotion/react */
import React from 'react';

import { Mint } from './Mint';
import { Tabs } from '../Tabs';
import { useStyles } from './styles';

export interface IMintRepayVaiProps {
  className?: string;
}

// TODO: Move to dashboard component/container once created
export const MintRepayVai: React.FC<IMintRepayVaiProps> = ({ className }) => {
  const styles = useStyles();
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  return (
    <div className={className} css={styles.container}>
      <div css={[styles.row, styles.header]}>
        <div css={[styles.column, styles.headerTitle]}>
          <h4>Mint/Repay VAI</h4>
        </div>

        <div css={[styles.column, styles.headerTabsContainer]}>
          <Tabs
            tabTitles={['Mint VAI', 'Repay VAI']}
            activeTabIndex={activeTabIndex}
            onChange={tabIndex => setActiveTabIndex(tabIndex)}
          />
        </div>
      </div>

      {/* TODO: add Repay component */}
      {activeTabIndex === 0 ? <Mint /> : undefined}
    </div>
  );
};
