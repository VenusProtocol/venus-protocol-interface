/** @jsxImportSource @emotion/react */
import type {
  SliderUnstyledMarkSlotProps,
  SliderUnstyledTrackSlotProps,
} from '@mui/base/SliderUnstyled';
import Box from '@mui/material/Box';
import MaterialSlider from '@mui/material/Slider';
import { SliderTypeMap } from '@mui/material/Slider/Slider';
import React, { useCallback } from 'react';

import { PALETTE } from 'theme/MuiThemeProvider/muiTheme';

import { Tooltip, TooltipProps } from '../Tooltip';
import { useStyles } from './styles';

export interface ProgressBarProps {
  value: number;
  secondaryValue?: number;
  mark?: number;
  step: number;
  ariaLabel: string;
  min: number;
  max: number;
  trackTooltip?: TooltipProps['title'];
  markTooltip?: TooltipProps['title'];
  className?: string;
  tooltipPlacement?: TooltipProps['placement'];
  progressBarColor?: string;
}

export const ProgressBar = ({
  value,
  secondaryValue,
  mark,
  step,
  ariaLabel,
  min,
  max,
  trackTooltip,
  markTooltip,
  className,
  tooltipPlacement = 'top',
  progressBarColor = PALETTE.interactive.success,
}: ProgressBarProps) => {
  const safeValue = value < max ? value : max;

  const marks = mark ? [{ value: mark }] : undefined;
  const styles = useStyles({
    over: mark ? safeValue > mark : false,
    secondaryOver: mark ? !!(secondaryValue && secondaryValue > mark) : false,
    progressBarColor,
  });

  const renderMark = useCallback(
    (
      props?: NonNullable<SliderTypeMap['props']['componentsProps']>['mark'] &
        SliderUnstyledMarkSlotProps,
    ) => (
      <Box
        component="span"
        style={props?.style}
        className={props?.className}
        css={[styles.mark, markTooltip ? styles.hasTooltip : undefined]}
      >
        {markTooltip && (
          <Tooltip placement={tooltipPlacement} title={markTooltip}>
            <span css={styles.tooltipHelper}>.</span>
          </Tooltip>
        )}
      </Box>
    ),
    [markTooltip, tooltipPlacement],
  );

  const renderTrack = useCallback(
    (
      props?: NonNullable<SliderTypeMap['props']['componentsProps']>['track'] &
        SliderUnstyledTrackSlotProps,
    ) => {
      const primaryRail = (
        <Box
          style={props?.style}
          css={[styles.trackWrapper, trackTooltip ? styles.hasTooltip : undefined]}
        >
          {trackTooltip ? (
            <Tooltip placement={tooltipPlacement} title={trackTooltip}>
              <Box className={props?.className} />
            </Tooltip>
          ) : (
            <Box className={props?.className} />
          )}
        </Box>
      );

      return (
        <>
          {primaryRail}

          {secondaryValue !== undefined && (
            <Box
              css={styles.secondaryRail(secondaryValue < max ? secondaryValue : max)}
              className={props?.className}
            />
          )}
        </>
      );
    },
    [trackTooltip, tooltipPlacement, secondaryValue, max],
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
