import { useTheme } from '@mui/material';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { useMemo } from 'react';

const useProgressColor = (value: number) => {
  const theme = useTheme();

  return useMemo(() => {
    if (value > SAFE_BORROW_LIMIT_PERCENTAGE) {
      return theme.palette.interactive.error;
    }

    if (value >= 50) {
      return theme.palette.interactive.warning;
    }

    return theme.palette.interactive.success;
  }, [
    value,
    theme.palette.interactive.error,
    theme.palette.interactive.success,
    theme.palette.interactive.warning,
  ]);
};

export default useProgressColor;
