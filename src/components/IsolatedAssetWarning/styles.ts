import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      position: relative;
    `,
    notice: css`
      padding: ${theme.spacing(3)};
      border-radius: ${theme.spacing(3)};
      margin-bottom: ${theme.spacing(2)};
    `,
    description: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    inlineButton: css`
      padding: 0;
      height: auto;

      > span {
        font-weight: ${theme.typography.body1.fontWeight};
      }
    `,
  };
};
