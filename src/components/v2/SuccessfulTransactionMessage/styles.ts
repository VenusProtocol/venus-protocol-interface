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
      width: 64px;
      height: 64px;
      color: ${theme.palette.interactive.success};
      margin-bottom: ${theme.spacing(3)};
    `,
    title: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    messageContainer: css`
      margin: auto;
      display: flex;
      align-items: center;
      margin-bottom: ${theme.spacing(5)};
    `,
    amountContainer: css`
      display: flex;
      align-items: center;
    `,
    amountTokenIcon: css`
      margin-left: ${theme.spacing(1)};
      margin-right: ${theme.spacing(0.5)};
    `,
  };
};
