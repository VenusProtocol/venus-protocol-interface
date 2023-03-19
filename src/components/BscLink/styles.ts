import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: inline-block;
      color: ${theme.palette.interactive.primary};
    `,
    text: css`
      display: flex;
      align-items: center;
      color: inherit;
    `,
    icon: css`
      color: inherit;
      margin-left: ${theme.spacing(2)};
    `,
  };
};
