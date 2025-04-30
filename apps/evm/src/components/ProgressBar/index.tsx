/** @jsxImportSource @emotion/react */
import Box from '@mui/material/Box';
import MaterialSlider from '@mui/material/Slider';
import type { SliderTypeMap } from '@mui/material/Slider/Slider';
import { useCallback } from 'react';

import { PALETTE } from 'App/MuiThemeProvider/muiTheme';

import { Tooltip, type TooltipProps } from '../Tooltip';
import { useStyles } from './styles';

export interface ProgressBarProps {
  value: number;
  secondaryValue?: number;
  mark?: number;
  step: number;
  ariaLabel: string;
  min: number;
  max: number;
  tooltip?: TooltipProps['content'];
  className?: string;
  progressBarColor?: string;
}

export const ProgressBar = ({
  value,
  mark,
  step,
  ariaLabel,
  min,
  max,
  tooltip,
  className,
  progressBarColor = PALETTE.interactive.success,
}: ProgressBarProps) => {
  const safeValue = value < max ? value : max;

  const marks = mark ? [{ value: mark }] : undefined;
  const styles = useStyles({
    over: mark ? safeValue > mark : false,
    progressBarColor,
  });

  const renderMark = useCallback(
    (
      props?: NonNullable<SliderTypeMap['props']['componentsProps']>['mark'] & {
        className?: string;
        style?: React.CSSProperties;
      },
    ) => (
      <Box component="span" style={props?.style} className={props?.className} css={styles.mark}>
        <span css={styles.tooltipHelper}>.</span>
      </Box>
    ),
    [styles.mark, styles.tooltipHelper],
  );

  const renderTrack = useCallback(
    (
      props?: NonNullable<SliderTypeMap['props']['componentsProps']>['track'] & {
        className?: string;
        style?: React.CSSProperties;
      },
    ) => {
      const primaryRail = (
        <Box style={props?.style} css={styles.trackWrapper}>
          <Box className={props?.className} />
        </Box>
      );

      return <>{primaryRail}</>;
    },
    [styles],
  );

  const dom = (
    <MaterialSlider
      className={className}
      css={styles.slider}
      components={{
        Thumb: undefined,
        Mark: mark ? renderMark : undefined,
        Track: renderTrack,
      }}
      value={safeValue}
      marks={marks}
      step={step}
      aria-label={ariaLabel}
      min={min}
      max={max}
      size="medium"
      disabled
    />
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{dom}</Tooltip>;
  }

  return dom;
};
