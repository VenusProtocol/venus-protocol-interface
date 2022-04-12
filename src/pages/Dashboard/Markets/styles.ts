import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    tableContainer: css`
      width: 100%;
      background-color: ${theme.palette.background.paper};
      border-radius: ${theme.shape.borderRadius.large}px;
      padding: ${theme.spacing(3, 0, 1)};
    `,
  };
};
