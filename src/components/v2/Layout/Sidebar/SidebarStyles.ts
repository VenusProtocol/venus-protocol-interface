import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    toolbar: { display: 'flex', justifyContent: 'center' },
    list: { paddingTop: 10 },
    listItem: {
      transition: 'color .3s',
      color: 'inherit',
      pl: 3,
      pr: 3,
      '&+&': {
        mt: 2,
      },
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    activeMenuItem: { color: theme.palette.primary.main },
    listItemIcon: { minWidth: 40, color: 'inherit' },
  };
};
