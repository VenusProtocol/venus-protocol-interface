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
      padding: ${theme.spacing(8, 10, 0)} !important;
      justify-content: space-between;
      display: flex;

      ${theme.breakpoints.down('lg')} {
        padding-left: ${theme.spacing(6)} !important;
        padding-right: ${theme.spacing(6)} !important;
      }

      ${theme.breakpoints.down('md')} {
        padding: ${theme.spacing(6, 4, 0)} !important;
      }
    `,
    claimXvsButton: css`
      margin-right: ${theme.spacing(6)};
    `,
  };
};
