import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      display: flex;
      flex-direction: column;
    `,
    spinner: css`
      height: 100%;
    `,
    successColor: theme.palette.interactive.success,
    againstColor: theme.palette.interactive.error,
    abstainColor: theme.palette.text.secondary,
  };
};
