/** @jsxImportSource @emotion/react */
import React, { InputHTMLAttributes } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Icon, IconName } from 'components/v2/Icon';

import { useStyles } from './styles';

export interface ITextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'css'> {
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
  ...inputProps
}) => {
  const styles = useStyles();

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

        <input css={styles.getInput({ hasRightAdornment: !!rightAdornment })} {...inputProps} />

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
