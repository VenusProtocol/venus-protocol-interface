/** @jsxImportSource @emotion/react */
import React from 'react';
import MaterialSlider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { SliderTypeMap } from '@mui/material/Slider/Slider';

import { Tooltip, ITooltipProps } from '../Tooltip';
import { useStyles } from './styles';

export interface IProgressBarProps {
  value: number;
  secondaryValue?: number;
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
}: IProgressBarProps) => {
  const safeValue = value < max ? value : max;

  const marks = mark ? [{ value: mark }] : undefined;
  const styles = useStyles({
    over: mark ? safeValue > mark : false,
    secondaryOver: mark ? !!(secondaryValue && secondaryValue > mark) : false,
  });

  const renderMark = (props?: NonNullable<SliderTypeMap['props']['componentsProps']>['mark']) => (
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
  );

  const renderTrack = (props?: NonNullable<SliderTypeMap['props']['componentsProps']>['track']) => {
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
