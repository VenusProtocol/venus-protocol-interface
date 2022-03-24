import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    appBar: css`
      background-image: none;
      background-color: transparent;
      box-shadow: none;
    `,
    toolbar: css`
      justify-content: space-between;
      display: flex;

      ${theme.breakpoints.down('md')} {
        display: none;
      }
    `,
    rightItemPaper: css`
      margin: ${theme.spacing(2)};
      align-items: center;
      padding: ${theme.spacing(1)};
      display: inline-flex;
      min-width: 165px;
      box-shadow: none;
    `,
  };
};
