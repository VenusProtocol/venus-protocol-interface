/** @jsxImportSource @emotion/react */
import React, { InputHTMLAttributes } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useStyles } from './styles';

export interface ITextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const TextField: React.FC<ITextFieldProps> = ({ label, ...inputProps }) => {
  const styles = useStyles();

  return (
    <Box css={inputProps.css}>
      {!!label && (
        <Typography variant="small1" component="label" for={inputProps.name} css={styles.label}>
          {label}
        </Typography>
      )}

      <Box css={styles.inputContainer}>
        <input css={styles.input} {...inputProps} />
      </Box>
    </Box>
  );
};
