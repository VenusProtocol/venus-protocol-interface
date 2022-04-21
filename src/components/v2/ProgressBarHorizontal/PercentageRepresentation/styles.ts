import { useTheme } from '@mui/material';
import { css } from '@emotion/react';

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
