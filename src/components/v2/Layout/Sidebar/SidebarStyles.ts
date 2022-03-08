import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    toolbar: { display: 'flex', justifyContent: 'center' },
    list: { paddingTop: 10 },
    listItem: {
      transition: 'color .3s',
      color: theme.palette.v2.text.secondary,
      pl: 3,
      pr: 3,
      '&+&': {
        mt: 2,
      },
      '&:hover': {
        color: theme.palette.v2.text.primary,
      },
    },
    activeMenuItem: { color: theme.palette.v2.text.primary },
    listItemIcon: { minWidth: 40, color: 'inherit' },
  };
};
