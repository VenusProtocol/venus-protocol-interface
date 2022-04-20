/** @jsxImportSource @emotion/react */
import React, { ReactElement, useState } from 'react';

import { TertiaryButton } from '../Button';
import useStyles from './styles';

export interface ITabsProps {
  tabTitles: string[];
  tabsContent: ReactElement[];
  componentTitle?: string;
  initialActiveTabIndex?: number;
  onTabChange?: (newIndex: number) => void;
  className?: string;
}

export const Tabs = ({
  tabTitles,
  initialActiveTabIndex = 0,
  onTabChange,
  className,
  tabsContent,
  componentTitle,
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
    <>
      <div
        css={styles.getContainer({
          hasTitle: !!componentTitle,
        })}
        className={className}
      >
        {componentTitle && (
          <div css={[styles.headerTitle]}>
            <h4>{componentTitle}</h4>
          </div>
        )}
        {tabTitles.map((tabTitle, index) => (
          <TertiaryButton
            key={tabTitle}
            onClick={() => handleChange(index)}
            css={styles.getButton({
              active: index === activeTabIndex,
              last: index === tabTitles.length - 1,
              fullWidth: !componentTitle,
            })}
          >
            {tabTitle}
          </TertiaryButton>
        ))}
      </div>
      {tabsContent[activeTabIndex]}
    </>
  );
};
