/** @jsxImportSource @emotion/react */
import React, { InputHTMLAttributes, HTMLAttributes } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Icon, IconName } from 'components/v2/Icon';
import { Button, IButtonProps } from 'components/v2/Button';

import { useStyles } from './styles';

export interface ITextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'css'> {
  css?: HTMLAttributes<HTMLDivElement>['css'];
  label?: string;
  description?: string;
  hasError?: boolean;
  leftIconName?: IconName;
  rightButtonProps?: Omit<IButtonProps, 'variant'> & {
    label: string;
  };
}

export const TextField: React.FC<ITextFieldProps> = ({
  css,
  label,
  description,
  hasError = false,
  leftIconName,
  rightButtonProps: { label: rightButtonLabel, ...rightButtonProps } = {},
  ...inputProps
}) => {
  const styles = useStyles();

  return (
    <Box css={css}>
      {!!label && (
        <Typography variant="small1" component="label" css={styles.getLabel({ hasError })}>
          {label}
        </Typography>
      )}

      <Box css={styles.getInputContainer({ hasError })}>
        {!!leftIconName && <Icon name={leftIconName} size={22} css={styles.leftIcon} />}

        <input css={styles.input} {...inputProps} />

        {rightButtonProps && (
          <Button variant="text" {...rightButtonProps} css={styles.rightButton}>
            {rightButtonLabel}
          </Button>
        )}
      </Box>

      {!!description && (
        <Typography variant="small2" css={styles.description}>
          {description}
        </Typography>
      )}
    </Box>
  );
};
