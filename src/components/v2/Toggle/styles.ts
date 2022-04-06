import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return css`
    width: 44px;
    height: 22px;
    padding: 0;
    & .MuiSwitch-switchBase {
      padding: 0;
      margin: 0;
      transition-duration: 300ms;
      color: ${theme.palette.text.disabled};
    }
    .MuiSwitch-switchBase.Mui-checked {
      transform: translateX(22px);
      .MuiSwitch-thumb {
        background-color: ${theme.palette.interactive.primary};
      }
    }
    .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track {
      opacity: 0.5;
    }
    .MuiSwitch-thumb {
      background-color: ${theme.palette.secondary.light};
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.35);
      box-sizing: border-box;
      width: 22px;
      height: 22px;
      transition: ${theme.transitions.create(['background-image'], {
        duration: 300999,
      })};
    }
    .MuiSwitch-track {
      border-radius: ${26 / 2}px;
      background-color: ${theme.palette.background.default};
    }
    .Mui-checked + .MuiSwitch-track {
      background-color: ${theme.palette.background.default};
      box-shadow: inset 0 3px 20px rgba(0, 0, 0, 0.15);
      opacity: 1;
    }
  `;
};
