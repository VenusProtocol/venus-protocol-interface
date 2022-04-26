/** @jsxImportSource @emotion/react */
import React from 'react';
import MaterialSlider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { SliderTypeMap } from '@mui/material/Slider/Slider';

import { Tooltip, ITooltipProps } from '../Tooltip';
import { useStyles } from './styles';

export interface IProgressBarProps {
  value: number;
  mark?: number;
  step: number;
  ariaLabel: string;
  min: number;
  max: number;
  trackTooltip?: ITooltipProps['title'];
  markTooltip?: ITooltipProps['title'];
  className?: string;
  tooltipPlacement?: ITooltipProps['placement'];
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
  tooltipPlacement = 'top',
}: IProgressBarProps) => {
  const marks = mark ? [{ value: mark }] : undefined;
  const styles = useStyles({ over: mark ? value > mark : false });

  const renderMark = (props?: NonNullable<SliderTypeMap['props']['componentsProps']>['mark']) => {
    if (markTooltip) {
      return (
        <Box component="span" {...props} css={[styles.mark, styles.hasTooltip]}>
          <Tooltip placement={tooltipPlacement} title={markTooltip}>
            <span css={styles.tooltipHelper}>.</span>
          </Tooltip>
        </Box>
      );
    }

    return <Box component="span" {...props} css={styles.mark} />;
  };

  const renderTrack = (props?: NonNullable<SliderTypeMap['props']['componentsProps']>['track']) => {
    if (trackTooltip) {
      return (
        <div style={props?.style} css={[styles.trackWrapper, styles.hasTooltip]}>
          <Tooltip placement={tooltipPlacement} title={trackTooltip}>
            {/* passed styles undefined here because wrapper is now handling this part */}
            <Box {...props} style={undefined} />
          </Tooltip>
        </div>
      );
    }

    return <Box css={styles.trackWrapper} {...props} />;
  };

  return (
    <MaterialSlider
      className={className}
      css={styles.slider}
      components={{
        Thumb: undefined,
        Mark: mark ? renderMark : undefined,
        Track: renderTrack,
      }}
      value={value}
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
