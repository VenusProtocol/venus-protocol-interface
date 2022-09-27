import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    notice: css`
      padding: ${theme.spacing(3)};
      border-radius: ${theme.spacing(3)};
      margin-bottom: ${theme.spacing(2)};
    `,
    description: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    showMarketsButton: css`
      padding: 0;

      > span {
        font-weight: ${theme.typography.body1.fontWeight};
      }
    `,
  };
};
