import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return css({
    width: 44,
    height: 22,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 0,
      transitionDuration: '300ms',
      color: theme.palette.text.disabled,
      '&.Mui-checked': {
        transform: 'translateX(22px)',
        color: theme.palette.error.main,
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.background.default,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
        '& .MuiSwitch-thumb': {
          backgroundColor: theme.palette.interactive.primary,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: theme.palette.interactive.success,
        border: '6px solid #fff',
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.text.secondary,
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.35)',
      boxSizing: 'border-box',
      width: 22,
      height: 22,
      transition: theme.transitions.create(['background-image'], {
        duration: 300,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.background.default,
      // backgroundColor: defaultTheme.palette.background.default,
      boxShadow: 'inset 0 3px 20px rgba(0, 0, 0, 0.15)',
      opacity: 1,
    },
    '&.Mui-checked+.MuiSwitch-track': {
      backgroundColor: theme.palette.background.default,
    },
  });
};
