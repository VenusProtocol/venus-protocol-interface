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
      flex-shrink: 0;
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
            background-color: ${
              isDark ? theme.palette.background.default : theme.palette.secondary.light
            };
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
        border-radius: ${thumbSize};
      }

      .MuiSwitch-track,
      .Mui-checked + .MuiSwitch-track {
        background-color: ${
          isDark ? theme.palette.background.default : theme.palette.secondary.light
        };
        opacity: 1;
      }
    `,
  };
};
