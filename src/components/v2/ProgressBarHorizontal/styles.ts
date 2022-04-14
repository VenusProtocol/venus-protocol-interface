import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = ({ over }: { over: boolean }) => {
  const theme = useTheme();
  return {
    slider: css`
      display: block;
      color: ${over ? theme.palette.interactive.error50 : theme.palette.interactive.success};
      background-color: ${theme.palette.background.default};
      height: ${theme.spacing(2)};
      padding: 0 !important;
      &.Mui-disabled {
        color: ${over ? theme.palette.interactive.error50 : theme.palette.interactive.success};
      }
      .MuiSlider-track {
        background-color: ${over
          ? theme.palette.interactive.error50
          : theme.palette.interactive.success};
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
    `,
    mark: css`
      position: absolute;
      border-radius: 1px;
      background-color: currentColor;
      top: 50%;
      transform: translate(-1px, -50%);
      z-index: 1;

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
  };
};

export default useStyles;
