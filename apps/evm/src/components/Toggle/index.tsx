/** @jsxImportSource @emotion/react */
import Switch, { type SwitchProps } from '@mui/material/Switch';
import { cn } from '@venusprotocol/ui';

import { InfoIcon } from '../InfoIcon';
import { useStyles } from './styles';

export interface ToggleProps extends Omit<SwitchProps, 'value'> {
  value: boolean;
  isDark?: boolean;
  label?: string;
  tooltip?: string;
}

export const switchAriaLabel = 'Switch';

export const Toggle = ({
  onChange,
  value,
  className,
  isDark = false,
  disabled = false,
  label,
  tooltip,
  ...otherProps
}: ToggleProps) => {
  const styles = useStyles();

  return (
    <div css={styles.container} className={className}>
      {!!tooltip && <InfoIcon className="mr-2" tooltip={tooltip} />}

      {!!label && <span className="mr-2 text-sm">{label}</span>}

      <Switch
        css={styles.getSwitch({ isDark })}
        className={cn(disabled && 'opacity-50')}
        focusVisibleClassName=".Mui-focusVisible"
        disableRipple
        onChange={onChange}
        onClick={e => e.stopPropagation()}
        checked={value}
        disabled={disabled}
        inputProps={{ 'aria-label': switchAriaLabel }}
        {...otherProps}
      />
    </div>
  );
};
