import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  console.log(theme);

  return {
    container: css``,
  };
};
