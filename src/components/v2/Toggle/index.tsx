/** @jsxImportSource @emotion/react */
import React from 'react';
import MaterialToggle from '@mui/material/Switch';
import { styles } from './Styles';

interface IToggleProps {
  onChange: (value: boolean) => void;
  value: boolean;
}

export const Toggle = ({ onChange, value }: IToggleProps) => {
  const wrappedOnChange = (event: React.SyntheticEvent | Event, v: boolean) => {
    console.log({ v });
    onChange(v);
  };
  return <MaterialToggle css={styles()} onChange={wrappedOnChange} checked={value} />;
};
