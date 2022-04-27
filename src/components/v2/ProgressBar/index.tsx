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
    const primaryRail = trackTooltip ? (
      <div style={props?.style} css={[styles.trackWrapper, styles.hasTooltip]}>
        <Tooltip placement={tooltipPlacement} title={trackTooltip}>
          {/* passed styles undefined here because wrapper is now handling this part */}
          <Box {...props} style={undefined} />
        </Tooltip>
      </div>
    ) : (
      <Box css={styles.trackWrapper} {...props} />
    );

    return (
      <>
        {primaryRail}

        {secondaryValue !== undefined && (
          <Box
            css={styles.secondaryRail(secondaryValue < max ? secondaryValue : max)}
            {...props}
            style={undefined}
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
