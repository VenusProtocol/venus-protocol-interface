/** @jsxImportSource @emotion/react */
import React, { InputHTMLAttributes } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Icon, IconName } from '../Icon';

import { useStyles } from './styles';

export interface ITextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  description?: string;
  hasError?: boolean;
  leftIconName?: IconName;
  rightAdornment?: React.ReactElement;
}

export const TextField: React.FC<ITextFieldProps> = ({
  className,
  label,
  description,
  hasError = false,
  leftIconName,
  rightAdornment,
  onChange,
  max,
  min,
  type,
  ...inputProps
}) => {
  const styles = useStyles();

  const handleChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = e => {
    // Prevent value from being updated if it does not follow the rules
    const respectsMaxRule =
      !e.currentTarget.value ||
      max === undefined ||
      type !== 'number' ||
      parseInt(e.currentTarget.value, 10) <= +max;

    const respectsMinRule =
      !e.currentTarget.value ||
      min === undefined ||
      type !== 'number' ||
      parseInt(e.currentTarget.value, 10) >= +min;

    if (onChange && respectsMaxRule && respectsMinRule) {
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

      <Box css={styles.getInputContainer({ hasError })}>
        {!!leftIconName && (
          <Icon name={leftIconName} size={styles.theme.spacing(3)} css={styles.leftIcon} />
        )}

        <input
          css={styles.getInput({ hasRightAdornment: !!rightAdornment })}
          max={max}
          min={min}
          onChange={handleChange}
          type={type}
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
