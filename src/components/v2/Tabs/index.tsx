/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';

import { TertiaryButton } from '../Button';
import useStyles from './styles';

export interface ITabsProps {
  tabTitles: string[];
  initialActiveTabIndex?: number;
  onTabChange?: (newIndex: number) => void;
  className?: string;
  fullWidth?: boolean;
}

export const Tabs = ({
  tabTitles,
  initialActiveTabIndex = 0,
  onTabChange,
  className,
  fullWidth = false,
}: ITabsProps) => {
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
    <div css={styles.getContainer({ fullWidth })} className={className}>
      {tabTitles.map((tabTitle, index) => (
        <TertiaryButton
          key={tabTitle}
          onClick={() => handleChange(index)}
          css={styles.getButton({
            active: index === activeTabIndex,
            last: index === tabTitles.length - 1,
            fullWidth,
          })}
        >
          {tabTitle}
        </TertiaryButton>
      ))}
    </div>
  );
};
