import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    getGridTemplateColumns: ({ isCardLayout }: { isCardLayout: boolean }) =>
      isCardLayout
        ? `1fr 1fr minmax(${theme.spacing(30)}, 1fr)`
        : `minmax(${theme.spacing(30)}, 1fr) 1fr minmax(${theme.spacing(
            33,
          )}, 1fr)  minmax(${theme.spacing(30)}, 1fr)`,
  };
};
