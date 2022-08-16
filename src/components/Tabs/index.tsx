/** @jsxImportSource @emotion/react */
import React, { ReactElement, useState } from 'react';

import { ButtonGroup } from '../ButtonGroup';
import useStyles from './styles';

export type TabContent = {
  title: string;
  content: ReactElement;
};

export interface TabsProps {
  tabsContent: TabContent[];
  initialActiveTabIndex?: number;
  onTabChange?: (newIndex: number) => void;
  className?: string;
}

export const Tabs = ({
  tabsContent,
  initialActiveTabIndex = 0,
  onTabChange,
  className,
}: TabsProps) => {
  const styles = useStyles();
  const [activeTabIndex, setActiveTabIndex] = useState(initialActiveTabIndex);

  const handleChange = (index: number) => {
    setActiveTabIndex(index);
    // Only call onTabChange callback if tab clicked isn't currently active
    if (index !== activeTabIndex && onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <div className={className}>
      <ButtonGroup
        buttonLabels={tabsContent.map(({ title }) => title)}
        css={styles.buttonsContainer}
        activeButtonIndex={activeTabIndex}
        onButtonClick={handleChange}
        fullWidth
      />

      {tabsContent[activeTabIndex].content}
    </div>
  );
};
