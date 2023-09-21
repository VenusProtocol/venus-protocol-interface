import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    placeholderContainer: css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
    `,
    placeholderText: css`
      margin: ${theme.spacing(8, 0)};
      text-align: center;
    `,
    wallet: css`
      height: ${theme.spacing(24)};
      background-color: rgba(40, 41, 49, 1);
      border-radius: 50%;
    `,
  };
};
