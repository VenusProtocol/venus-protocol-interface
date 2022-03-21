import React from 'react';
import { Global } from '@emotion/react';
import MuiTooltip, { TooltipProps } from '@mui/material/Tooltip';
import { useStyles } from './styles';

type ITooltipProps = TooltipProps;

export const Tooltip = ({ children, ...rest }: ITooltipProps) => {
  const styles = useStyles();
  return (
    <>
      <Global styles={styles} />
      <MuiTooltip arrow placement="top" {...rest}>
        {children}
      </MuiTooltip>
    </>
  );
};
