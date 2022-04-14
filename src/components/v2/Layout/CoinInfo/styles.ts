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
      padding: ${theme.spacing(3)} ${theme.spacing(4)};
      box-shadow: none;
      > * {
        margin-right: ${theme.spacing(3)};
      }
      p {
        color: ${theme.palette.text.primary};
      }
    `,
  };
};
