/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
import { SwitchBaseProps } from '@mui/material/internal/SwitchBase';
import React from 'react';

import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { useStyles } from './styles';

export interface ToggleProps {
  onChange: SwitchBaseProps['onChange'];
  value: boolean;
  className?: string;
  isLight?: boolean;
  label?: string;
  tooltip?: string;
}

export const switchAriaLabel = 'Switch';
const otherSwitchProps = { inputProps: { 'aria-label': switchAriaLabel } };

export const Toggle = ({
  onChange,
  value,
  className,
  isLight = false,
  label,
  tooltip,
}: ToggleProps) => {
  const styles = useStyles();

  return (
    <div css={styles.container} className={className}>
      {!!tooltip && (
        <Tooltip css={styles.tooltip} title={tooltip}>
          <Icon css={styles.infoIcon} name="info" />
        </Tooltip>
      )}

      {!!label && (
        <Typography color="text.primary" variant="small1" component="span" css={styles.label}>
          {label}
        </Typography>
      )}

      <Switch
        css={styles.getSwitch({ isLight })}
        focusVisibleClassName=".Mui-focusVisible"
        disableRipple
        onChange={onChange}
        checked={value}
        {...otherSwitchProps}
      />
    </div>
  );
};
