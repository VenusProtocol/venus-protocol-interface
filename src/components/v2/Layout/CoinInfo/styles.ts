import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    coinInfo: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: start;
      padding: ${theme.spacing(1.5)} ${theme.spacing(2)};
      box-shadow: none;
      > * {
        margin-right: ${theme.spacing(1.5)};
      }
      p {
        color: ${theme.palette.text.primary};
      }
    `,
  };
};
