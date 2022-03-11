/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import MaterialSlider from '@mui/material/Slider';
import { styles } from './Styles';

interface ISliderProps {
  defaultValue: number;
  mark: number;
  step: number;
  ariaLabel: string;
  min: number;
  max: number;
  onChange: (value: number | number[]) => void;
}

export const Slider = ({
  defaultValue,
  mark,
  step,
  ariaLabel,
  min,
  max,
  onChange,
}: ISliderProps) => {
  const marks = mark ? [{ value: mark }] : undefined;
  const [over, setOver] = useState(defaultValue > mark);
  const wrappedOnChange = (event: React.SyntheticEvent | Event, value: number | number[]) => {
    setOver(value > mark);
    onChange(value);
  };
  return (
    <MaterialSlider
      css={styles({ over })}
      onChange={wrappedOnChange}
      components={{ Thumb: undefined }}
      defaultValue={defaultValue}
      marks={marks}
      step={step}
      aria-label={ariaLabel}
      min={min}
      max={max}
      size="medium"
    />
  );
};
