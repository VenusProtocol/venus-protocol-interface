import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    defaultChartColor: theme.palette.interactive.success,
    gridLineColor: theme.palette.secondary.light,
    accessoryColor: theme.palette.text.secondary,
  };
};
