/** @jsxImportSource @emotion/react */
import React from 'react';

import { TertiaryButton } from '../Button';
import useStyles from './styles';

export interface ITabsProps {
  tabTitles: string[];
  activeTabIndex: number;
  onChange: (newIndex: number) => void;
  className?: string;
  fullWidth?: boolean;
}

export const Tabs = ({
  tabTitles,
  activeTabIndex,
  onChange,
  className,
  fullWidth = false,
}: ITabsProps) => {
  const styles = useStyles();

  return (
    <div css={styles.getContainer({ fullWidth })} className={className}>
      {tabTitles.map((tabTitle, index) => (
        <TertiaryButton
          key={tabTitle}
          onClick={() => {
            // Only call onChange callback if tab clicked isn't currently active
            if (index !== activeTabIndex) {
              onChange(index);
            }
          }}
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
