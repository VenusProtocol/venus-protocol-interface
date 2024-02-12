import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      width: 100%;
    `,
    notice: css`
      margin-bottom: ${theme.spacing(8)};
    `,
  };
};
