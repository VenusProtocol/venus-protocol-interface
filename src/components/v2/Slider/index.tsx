/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import MaterialSlider from '@mui/material/Slider';
import { useStyles } from './styles';

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

  const styles = useStyles({ over });

  return (
    <MaterialSlider
      css={styles}
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
