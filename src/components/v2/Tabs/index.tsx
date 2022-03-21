/** @jsxImportSource @emotion/react */
import React from 'react';
import { SerializedStyles } from '@emotion/react';

import { Button } from '../Button';
import useStyles from './styles';

export interface ITabsProps {
  options: string[];
  activeOptionIndex: number;
  onChange: (newIndex: number) => void;
  css?: SerializedStyles;
}

export const Tabs = ({ options, onChange, css }: ITabsProps) => {
  const styles = useStyles();

  return (
    <div css={[styles.container, css]}>
      {options.map((option, index) => (
        <Button key={option} onClick={() => onChange(index)} css={styles.button}>
          {option}
        </Button>
      ))}
    </div>
  );
};
