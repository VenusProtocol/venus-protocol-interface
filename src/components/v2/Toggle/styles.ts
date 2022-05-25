import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  const thumbSize = theme.spacing(5.5);

  return css`
    width: calc(${thumbSize} * 2);
    height: ${thumbSize};
    padding: 0;
    & .MuiSwitch-switchBase {
      padding: 0;
      margin: 0;
      transition-duration: 300ms;
      color: ${theme.palette.background.default};
      &.Mui-checked {
        color: ${theme.palette.background.default};
        transform: translateX(${thumbSize});
        .MuiSwitch-thumb {
          background-color: ${theme.palette.interactive.primary};
        }
        & + .MuiSwitch-track {
          background-color: ${theme.palette.background.default};
        }
      }
      &.Mui-disabled + .MuiSwitch-track {
        opacity: 0.5;
      }
    }
    .MuiSwitch-thumb {
      background-color: ${theme.palette.secondary.light};
      box-shadow: none;
      box-sizing: border-box;
      width: ${thumbSize};
      height: ${thumbSize};
    }
    .MuiSwitch-track {
      border-radius: ${thumbSize};
      background-color: ${theme.palette.background.default};
      opacity: 1;
    }
    .Mui-checked + .MuiSwitch-track {
      background-color: ${theme.palette.background.default};
      opacity: 1;
    }
  `;
};
