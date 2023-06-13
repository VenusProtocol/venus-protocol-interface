import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = ({
  over,
  secondaryOver,
  progressBarColor,
}: {
  over: boolean;
  secondaryOver: boolean;
  progressBarColor: string;
}) => {
  const theme = useTheme();
  return {
    slider: css`
      z-index: 0;
      display: block;
      color: ${over ? theme.palette.interactive.error50 : progressBarColor};
      background-color: ${theme.palette.background.default};
      height: ${theme.spacing(2)};
      padding: 0 !important;
      &.Mui-disabled {
        color: ${over ? theme.palette.interactive.error50 : progressBarColor};
      }
      .MuiSlider-track {
        background-color: ${over ? theme.palette.interactive.error50 : progressBarColor};
        height: ${theme.spacing(2)};
        border-radius: ${theme.spacing(1)};
      }
      .MuiSlider-rail {
        height: ${theme.spacing(2)};
        color: ${theme.palette.background.default};
      }
    `,
    trackWrapper: css`
      position: relative;
      z-index: 20;
    `,
    mark: css`
      position: absolute;
      border-radius: 1px;
      background-color: currentColor;
      top: 50%;
      transform: translate(-1px, -50%);
      z-index: 30;

      /* theme styles */
      width: ${theme.spacing(1)};
      height: ${theme.spacing(2)};
      color: ${theme.palette.interactive.error};
    `,
    hasTooltip: css`
      /* for tooltips working in disabled state */
      cursor: help;
      pointer-events: all;
    `,
    tooltipHelper: css`
      visibility: hidden;
    `,
    secondaryRail: (value: number | undefined) => css`
      ${value ? `width: ${value}%;` : 'display: none;'}
      &.MuiSlider-track {
        background-color: ${secondaryOver
          ? theme.palette.interactive.error50
          : theme.palette.interactive.success50};
      }
      position: absolute;
      top: 0;
      z-index: 10;
    `,
  };
};

export default useStyles;
