import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
      flex-direction: column;
    `,
    topValue: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
