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
  trackTooltip?: TooltipProps['content'];
  markTooltip?: TooltipProps['content'];
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
  trackTooltip,
  markTooltip,
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
      <Box
        component="span"
        style={props?.style}
        className={props?.className}
        css={[styles.mark, markTooltip ? styles.hasTooltip : undefined]}
      >
        {markTooltip && (
          <Tooltip content={markTooltip}>
            <span css={styles.tooltipHelper}>.</span>
          </Tooltip>
        )}
      </Box>
    ),
    [markTooltip, styles.hasTooltip, styles.mark, styles.tooltipHelper],
  );

  const renderTrack = useCallback(
    (
      props?: NonNullable<SliderTypeMap['props']['componentsProps']>['track'] & {
        className?: string;
        style?: React.CSSProperties;
      },
    ) => {
      const primaryRail = (
        <Box
          style={props?.style}
          css={[styles.trackWrapper, trackTooltip ? styles.hasTooltip : undefined]}
        >
          {trackTooltip ? (
            <Tooltip content={trackTooltip}>
              <Box className={props?.className} />
            </Tooltip>
          ) : (
            <Box className={props?.className} />
          )}
        </Box>
      );

      return <>{primaryRail}</>;
    },
    [trackTooltip, styles],
  );

  return (
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
};
