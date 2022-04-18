/** @jsxImportSource @emotion/react */
import React from 'react';
import MaterialSlider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { SliderTypeMap } from '@mui/material/Slider/Slider';

import { Tooltip, ITooltipProps } from '../Tooltip';
import { useStyles } from './styles';

export interface ISliderProps {
  value: number;
  mark: number;
  step: number;
  ariaLabel: string;
  min: number;
  max: number;
  trackTooltip?: ITooltipProps['title'];
  markTooltip?: ITooltipProps['title'];
  isDisabled?: boolean;
  className?: string;
  tooltipPlacement?: ITooltipProps['placement'];
}

export const ProgressBarHorizontal = ({
  value,
  mark,
  step,
  ariaLabel,
  min,
  max,
  isDisabled,
  trackTooltip,
  markTooltip,
  className,
  tooltipPlacement = 'top',
}: ISliderProps) => {
  const marks = mark ? [{ value: mark }] : undefined;
  const styles = useStyles({ over: value > mark });

  const renderMark = (props?: NonNullable<SliderTypeMap['props']['componentsProps']>['mark']) => {
    if (markTooltip) {
      return (
        <span {...props} css={[styles.mark, styles.hasTooltip]}>
          <Tooltip placement={tooltipPlacement} title={markTooltip}>
            <span css={styles.tooltipHelper}>.</span>
          </Tooltip>
        </span>
      );
    }

    return <span {...props} css={styles.mark} />;
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
        Mark: renderMark,
        Track: renderTrack,
      }}
      value={value}
      marks={marks}
      step={step}
      aria-label={ariaLabel}
      min={min}
      max={max}
      size="medium"
      disabled={isDisabled}
    />
  );
};
