/** @jsxImportSource @emotion/react */
import React, { InputHTMLAttributes } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Icon, IconName } from 'components/v2/Icon';

import { useStyles } from './styles';

export interface ITextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  hasError?: boolean;
  leftIconName?: IconName;
}

export const TextField: React.FC<ITextFieldProps> = ({
  label,
  description,
  hasError = false,
  leftIconName,
  ...inputProps
}) => {
  const styles = useStyles();

  return (
    <Box css={inputProps.css}>
      {!!label && (
        <Typography variant="small1" component="label" css={styles.getLabel({ hasError })}>
          {label}
        </Typography>
      )}

      <Box css={styles.getInputContainer({ hasError })}>
        {!!leftIconName && <Icon name={leftIconName} size={22} css={styles.leftIcon} />}

        <input css={styles.input} {...inputProps} />
      </Box>

      {!!description && (
        <Typography variant="small2" css={styles.description}>
          {description}
        </Typography>
      )}
    </Box>
  );
};
