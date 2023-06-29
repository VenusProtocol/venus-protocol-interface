import { useTheme } from '@mui/material';
import { useMemo } from 'react';

const useProgressColor = (value: number) => {
  const theme = useTheme();

  return useMemo(() => {
    if (value >= 80) {
      return theme.palette.interactive.error;
    }

    if (value >= 50) {
      return theme.palette.interactive.warning;
    }

    return theme.palette.interactive.success;
  }, [value]);
};

export default useProgressColor;
