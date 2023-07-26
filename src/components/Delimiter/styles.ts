import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useDelimiterStyles = () => {
  const theme = useTheme();

  return {
    root: css`
      margin-top: 0;
      margin-bottom: 0;
      border: 0;
      height: 1px;
      background-color: ${theme.palette.secondary.light};
    `,
  };
};
