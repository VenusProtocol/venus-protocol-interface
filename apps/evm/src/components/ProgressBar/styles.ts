import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = ({
  over,
  progressBarColor,
}: {
  over: boolean;
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
        color: ${theme.palette.secondary.light};
        opacity: 1;
      }
    `,
    trackWrapper: css`
      position: relative;
      z-index: 20;
    `,
    mark: css`
      position: absolute;
      border-radius: 1px;
      top: 50%;
      transform: translate(-1px, -50%);
      z-index: 30;
      background-color: currentcolor;

      /* theme styles */
      width: ${theme.spacing(1)};
      height: ${theme.spacing(2)};
      color: ${theme.palette.interactive.error};
    `,
    tooltipHelper: css`
      visibility: hidden;
    `,
  };
};

export default useStyles;
