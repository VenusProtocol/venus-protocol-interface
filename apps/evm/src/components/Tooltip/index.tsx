import { Global } from '@emotion/react';
import MuiTooltip, { type TooltipProps as MUITooltipProps } from '@mui/material/Tooltip';

import { useStyles } from './styles';

export interface TooltipProps extends Omit<MUITooltipProps, 'children'> {
  title: string | React.ReactElement;
  children: React.ReactNode;
}

export const Tooltip = ({ children, placement = 'top', ...rest }: TooltipProps) => {
  const styles = useStyles();

  return (
    <>
      <Global styles={styles} />
      <MuiTooltip
        onClick={e => e.preventDefault()}
        arrow
        placement={placement}
        enterTouchDelay={0}
        {...rest}
      >
        <span>{children}</span>
      </MuiTooltip>
    </>
  );
};
