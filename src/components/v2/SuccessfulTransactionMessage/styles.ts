import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
      flex-direction: column;
      align-items: center;
    `,
    headerIcon: css`
      width: ${theme.spacing(16)};
      height: ${theme.spacing(16)};
      color: ${theme.palette.interactive.success};
      margin-bottom: ${theme.spacing(6)};
    `,
    title: css`
      margin-bottom: ${theme.spacing(4)};
    `,
    messageContainer: css`
      margin: auto;
      display: flex;
      align-items: center;
      margin-bottom: ${theme.spacing(10)};
    `,
    amountContainer: css`
      display: flex;
      align-items: center;
    `,
    amountTokenIcon: css`
      margin-left: ${theme.spacing(2)};
      margin-right: ${theme.spacing(1)};
    `,
  };
};
