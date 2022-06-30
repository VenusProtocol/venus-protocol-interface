import React from 'react';
import { Global } from '@emotion/react';
import MuiTooltip, { TooltipProps } from '@mui/material/Tooltip';
import { useStyles } from './styles';

export interface ITooltipProps extends TooltipProps {
  title: string | React.ReactElement;
}

export const Tooltip = ({ children, placement = 'top', ...rest }: ITooltipProps) => {
  const styles = useStyles();

  return (
    <>
      <Global styles={styles} />
      <MuiTooltip arrow placement={placement} {...rest}>
        <span>{children}</span>
      </MuiTooltip>
    </>
  );
};
