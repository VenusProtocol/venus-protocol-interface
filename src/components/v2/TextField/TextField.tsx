/** @jsxImportSource @emotion/react */
import React, { InputHTMLAttributes } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useStyles } from './styles';

export interface ITextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const TextField: React.FC<ITextFieldProps> = ({ label, description, ...inputProps }) => {
  const styles = useStyles();

  return (
    <Box css={inputProps.css}>
      {!!label && (
        <Typography variant="small1" component="label" css={styles.label}>
          {label}
        </Typography>
      )}

      <Box css={styles.inputContainer}>
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
