import { css } from '@emotion/react';
import { alpha, useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    container: css`
      display: flex;
      align-items: center;
      justify-content: center;
      margin: ${theme.spacing(4, 10, 0)};
      padding: ${theme.spacing(3, 4)};
      border-radius: ${theme.shape.borderRadius.verySmall}px;
      border: 1px solid ${theme.palette.interactive.warning};
      background-color: ${alpha(theme.palette.interactive.warning as string, 0.1)};

      ${theme.breakpoints.down('lg')} {
        margin: ${theme.spacing(6, 6, 0)};
      }
      ${theme.breakpoints.down('md')} {
        margin: ${theme.spacing(4, 4, 0)};
      }
    `,
    content: css`
      display: flex;
      align-items: center;
      margin: 0 auto;
    `,
    text: css`
      color: ${theme.palette.text.primary};
    `,
    icon: css`
      flex-shrink: 0;
      color: ${theme.palette.interactive.warning};
      margin-right: ${theme.spacing(2)};
      width: ${theme.spacing(6)};
      height: ${theme.spacing(6)};
    `,
  };
};
