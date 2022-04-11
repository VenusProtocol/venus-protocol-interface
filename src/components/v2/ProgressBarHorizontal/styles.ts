import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = ({ over }: { over: boolean }) => {
  const theme = useTheme();
  return {
    slider: css`
      color: ${over ? theme.palette.interactive.error50 : theme.palette.interactive.success};
      background-color: ${theme.palette.background.default};
      height: 8px;
      padding: 0;
      &.Mui-disabled {
        color: ${over ? theme.palette.interactive.error50 : theme.palette.interactive.success};
      }
      .MuiSlider-track {
        background-color: ${over
          ? theme.palette.interactive.error50
          : theme.palette.interactive.success};
        height: 8px;
        border-radius: 4px;
      }
      .MuiSlider-rail {
        height: 8px;
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
      width: 4px;
      height: 8px;
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
