import React from 'react';

import MuiTooltip, { TooltipProps } from '@mui/material/Tooltip';
import { useTooltipStyles as useStyles } from './TooltipStyles';

type ITooltipProps = TooltipProps;

export const Tooltip = (props: ITooltipProps) => {
  const styles = useStyles();
  const { children } = props;
  return (
    <MuiTooltip sx={styles} arrow placement="top" {...props} open>
      {children}
    </MuiTooltip>
  );
};
