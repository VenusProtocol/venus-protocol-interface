/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import Switch from '@mui/material/Switch';
import type { SwitchBaseProps } from '@mui/material/internal/SwitchBase';

import { InfoIcon } from '../InfoIcon';
import { useStyles } from './styles';

export interface ToggleProps {
  onChange: SwitchBaseProps['onChange'];
  value: boolean;
  disabled?: boolean;
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
  disabled = false,
  label,
  tooltip,
}: ToggleProps) => {
  const styles = useStyles();

  return (
    <div css={styles.container} className={className}>
      {!!tooltip && <InfoIcon css={styles.infoIcon} tooltip={tooltip} />}

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
        onClick={e => e.stopPropagation()}
        checked={value}
        disabled={disabled}
        {...otherSwitchProps}
      />
    </div>
  );
};
