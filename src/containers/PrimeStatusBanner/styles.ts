import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
      justify-content: space-between;
    `,
    column: css`
      :not(:last-child) {
        margin-right: ${theme.spacing(6)};
      }
    `,
    header: css`
      display: flex;
    `,
    primeLogo: css`
      display: block;
      width: ${theme.spacing(10)};
      margin-right: ${theme.spacing(4)};
    `,
    title: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    greenText: css`
      color: ${theme.palette.interactive.success};
    `,
    whiteText: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
