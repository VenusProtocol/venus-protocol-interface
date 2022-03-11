import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    width: 44,
    height: 22,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 0,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(22px)',
        color: '#fff',
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
        '& .MuiSwitch-thumb': {
          backgroundImage: 'linear-gradient(180deg, #EF9037 20.59%, #E93E44 85.35%)',
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundImage: 'linear-gradient(180deg, #484E56 17.71%, #3B4048 90.44%)',
      boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.35)',
      boxSizing: 'border-box',
      width: 22,
      height: 22,
      transition: theme.transitions.create(['background-image'], {
        duration: 300,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundImage: 'linear-gradient(180deg, #282B30 0%, #1E2124 100%)',
      boxShadow: 'inset 0px 3px 20px rgba(0, 0, 0, 0.15)',
      opacity: 1,
    },
  };
};
