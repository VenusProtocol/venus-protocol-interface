import React from 'react';
import { Global } from '@emotion/react';
import MuiTooltip, { TooltipProps } from '@mui/material/Tooltip';
import { useStyles } from './styles';

export { type TooltipProps } from '@mui/material/Tooltip';

export const Tooltip: React.FC<TooltipProps> = ({ children, ...rest }) => {
  const styles = useStyles();

  return (
    <>
      <Global styles={styles} />
      <MuiTooltip arrow placement="top" {...rest}>
        <span>{children}</span>
      </MuiTooltip>
    </>
  );
};
