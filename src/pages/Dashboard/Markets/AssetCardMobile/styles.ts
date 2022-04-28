import { useTheme } from '@mui/material';
import { css } from '@emotion/react';

export const useStyles = () => {
  const theme = useTheme();
  return {
    tableContainer: css`
      padding: 0;
      margin-top: ${theme.spacing(6)};
      margin-bottom: ${theme.spacing(6)};
    `,
    title: css`
      padding: ${theme.spacing(6)};
    `,
    delimiter: css`
      margin-left: ${theme.spacing(6)};
      margin-right: ${theme.spacing(6)};
    `,
  };
};
