import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    root: css`
      display: flex;
      align-items: center;
    `,
    percentage: css`
      margin-left: ${theme.spacing(2)};
    `,
  };
};
