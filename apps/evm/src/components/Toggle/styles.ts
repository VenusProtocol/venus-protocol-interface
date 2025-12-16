import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  const thumbSize = theme.spacing(5.5);

  return {
    container: css`
      display: inline-flex;
      align-items: center;
    `,
    label: css`
      margin-right: ${theme.spacing(2)};
    `,
    getSwitch: ({ isDark }: { isDark: boolean }) => css`
      shrink: 0;
      width: calc(${thumbSize} * 2);
      height: ${thumbSize};
      padding: 0;

      & .MuiSwitch-switchBase {
        padding: 0;
        margin: 0;
        transition-duration: 300ms;
        color: ${theme.palette.secondary.light};

        &.Mui-checked {
          color: ${theme.palette.secondary.light};
          transform: translateX(${thumbSize});

          .MuiSwitch-thumb {
            background-color: ${theme.palette.interactive.primary};
          }

          & + .MuiSwitch-track {
            background-color: ${theme.palette.secondary.light};
            opacity: 1;
          }
        }
      }

      .MuiSwitch-thumb {
        background-color: ${isDark ? theme.palette.secondary.light : theme.palette.text.secondary};
        box-shadow: none;
        box-sizing: border-box;
        width: ${thumbSize};
        height: ${thumbSize};
      }

      .MuiSwitch-track {
        background-color: ${theme.palette.secondary.light};
        opacity: 1;
        border-radius: ${thumbSize};
      }

      .MuiSwitch-track,
      .Mui-checked + .MuiSwitch-track {
        background-color: ${theme.palette.secondary.light};
        opacity: 1;
      }
    `,
  };
};
