import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useDelimiterStyles = () => {
  const theme = useTheme();

  return {
    root: css`
      margin-top: 0;
      margin-bottom: 0;
      border-color: ${theme.palette.secondary.light};
      border-style: solid;
    `,
  };
};
