/** @jsxImportSource @emotion/react */
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React, { InputHTMLAttributes } from 'react';
import { Token } from 'types';

import { Icon, IconName } from '../Icon';
import { TokenIcon } from '../TokenIcon';
import { useStyles } from './styles';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  description?: string | React.ReactElement;
  hasError?: boolean;
  leftIconSrc?: IconName | Token;
  rightAdornment?: React.ReactElement;
  isSmall?: boolean;
  variant?: 'primary' | 'secondary';
}

export const TextField: React.FC<TextFieldProps> = ({
  className,
  label,
  description,
  hasError = false,
  leftIconSrc,
  rightAdornment,
  onChange,
  max,
  min,
  type,
  disabled,
  isSmall = false,
  variant = 'primary',
  ...inputProps
}) => {
  const styles = useStyles();

  const handleChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = e => {
    let safeValue = e.currentTarget.value;
    if (type === 'number' && safeValue.startsWith('.')) {
      safeValue = `0${safeValue}`;
    }
    // Prevent value from being updated if it does not follow the rules
    const followsMaxRule =
      !safeValue || max === undefined || type !== 'number' || parseInt(safeValue, 10) <= +max;

    const followsMinRule =
      !safeValue || min === undefined || type !== 'number' || parseInt(safeValue, 10) >= +min;
    if (onChange && followsMaxRule && followsMinRule) {
      onChange(e);
    }
  };

  return (
    <Box className={className}>
      {!!label && (
        <Typography
          variant="small1"
          component="label"
          css={styles.getLabel({ hasError })}
          htmlFor={inputProps.id}
        >
          {label}
        </Typography>
      )}

      <Box css={styles.getInputContainer({ hasError, disabled, variant, isSmall })}>
        {typeof leftIconSrc === 'string' && (
          <Icon name={leftIconSrc} css={styles.getLeftIcon({ isSmall })} />
        )}

        {!!leftIconSrc && typeof leftIconSrc !== 'string' && (
          <TokenIcon token={leftIconSrc} css={styles.getLeftIcon({ isSmall })} />
        )}

        <input
          css={styles.getInput({ hasRightAdornment: !!rightAdornment, isSmall })}
          max={max}
          min={min}
          onChange={handleChange}
          type={type}
          disabled={disabled}
          {...inputProps}
        />

        {rightAdornment}
      </Box>

      {!!description && (
        <Typography variant="small2" css={styles.description}>
          {description}
        </Typography>
      )}
    </Box>
  );
};
