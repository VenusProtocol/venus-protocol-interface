import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
      align-items: center;
    `,
    token: css`
      margin-right: ${theme.spacing(1)};
    `,
    leftoverCount: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
