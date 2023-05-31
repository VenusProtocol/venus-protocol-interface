import { Global } from '@emotion/react';
import MuiTooltip, { TooltipProps as MUITooltipProps } from '@mui/material/Tooltip';
import React from 'react';

import { useStyles } from './styles';

export interface TooltipProps extends MUITooltipProps {
  title: string | React.ReactElement;
}

export const Tooltip = ({ children, placement = 'top', ...rest }: TooltipProps) => {
  const styles = useStyles();

  return (
    <>
      <Global styles={styles} />
      <MuiTooltip arrow placement={placement} enterTouchDelay={0} {...rest}>
        <span>{children}</span>
      </MuiTooltip>
    </>
  );
};
