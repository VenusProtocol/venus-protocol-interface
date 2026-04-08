/** @jsxImportSource @emotion/react */
import Box from '@mui/material/Box';
import MaterialSlider from '@mui/material/Slider';
import type { SliderTypeMap } from '@mui/material/Slider/Slider';
import { useCallback } from 'react';

import { PALETTE } from 'App/MuiThemeProvider/muiTheme';

import { Tooltip, type TooltipProps } from '../Tooltip';
import { useStyles } from './styles';

export interface ProgressBarMark {
  value: number;
  color?: string;
}

export interface ProgressBarProps {
  value: number;
  secondaryValue?: number;
  marks?: ProgressBarMark[];
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
  marks,
  step,
  ariaLabel,
  min,
  max,
  tooltip,
  className,
  progressBarColor = PALETTE.interactive.success,
}: ProgressBarProps) => {
  const safeValue = value < max ? value : max;

  const sliderMarks = marks?.map(m => ({ value: m.value }));
  const hasMarks = !!marks && marks.length > 0;

  const styles = useStyles({
    over: hasMarks ? safeValue > marks[0].value : false,
    progressBarColor,
  });

  const renderMark = useCallback(
    (
      props?: NonNullable<SliderTypeMap['props']['componentsProps']>['mark'] & {
        className?: string;
        style?: React.CSSProperties;
        'data-index'?: number;
      },
    ) => {
      const index = props?.['data-index'] ?? 0;
      const markColor = marks?.[index]?.color;

      return (
        <Box
          component="span"
          style={{ ...props?.style, ...(markColor ? { color: markColor } : {}) }}
          className={props?.className}
          css={styles.mark}
        >
          <span css={styles.tooltipHelper}>.</span>
        </Box>
      );
    },
    [styles.mark, styles.tooltipHelper, marks],
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
        Mark: hasMarks ? renderMark : undefined,
        Track: renderTrack,
      }}
      value={safeValue}
      marks={sliderMarks}
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
